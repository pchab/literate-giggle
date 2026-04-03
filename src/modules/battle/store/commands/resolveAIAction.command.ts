import { cardLibrary } from "@/modules/cards/data/cards.data";
import { sleep } from "@/modules/shared/helpers/sleep";
import { isHero } from "@/modules/units/helpers/units.helpers";
import { handleAICardIntent } from "../../helpers/ai.actions.helpers";
import { tickStatusesAndSurfaces } from "../../helpers/effects/effect.helpers";
import { finalizeAction } from "../../helpers/encounter.helpers";
import type { StoreGet, StoreSet } from "../battle.store";
import { calculateAIIntents } from "./calculateAIIntents.command";

export const resolveAIActions = async (
	get: StoreGet,
	set: StoreSet,
	isSimulation = false,
) => {
	// ==========================================
	// 1. START OF AI TURN (Tick AI statuses)
	// ==========================================
	const { units: draftUnits } = get();
	const draftAIUnits = draftUnits.filter((u) => !isHero(u));

	await tickStatusesAndSurfaces(get, set, isSimulation)(draftAIUnits);
	await sleep(isSimulation ? 0 : 200);

	// ==========================================
	// 2. EXECUTE ACTIONS
	// ==========================================
	const stateAfterTick = get();
	const allAIUnits = stateAfterTick.units.filter(
		(u) => !isHero(u) && u.currentHp > 0,
	);

	for (const aiUnit of allAIUnits) {
		const { units, aiIntents } = get();

		const freshAIunit = units.find((u) => u.id === aiUnit.id);
		if (!freshAIunit || freshAIunit.currentHp <= 0) continue;

		const intent = aiIntents[freshAIunit.id];
		if (!intent) continue;

		const cardToPlay = cardLibrary[intent.cardId];
		if (!cardToPlay) continue;

		await handleAICardIntent(
			get,
			set,
			isSimulation,
		)({
			attackerId: freshAIunit.id,
			card: cardToPlay,
		});
	}

	// ============================================
	// 3. START OF PLAYER TURN (Tick Hero statuses)
	// ============================================
	const { units: currentUnits } = get();
	const heroes = currentUnits.filter(isHero);

	await tickStatusesAndSurfaces(get, set, isSimulation)(heroes);

	set(({ units, xpEarned, ...prev }) => {
		const survivingUnits = units.filter((u) => u.currentHp > 0);

		return {
			...prev,
			units: survivingUnits,
			usedMovesThisTurn: {},
			usedCardsThisTurn: {},
		};
	});

	if (!isSimulation) {
		await finalizeAction(get, set, draftUnits);
		await calculateAIIntents(get, set)({});
	}
};
