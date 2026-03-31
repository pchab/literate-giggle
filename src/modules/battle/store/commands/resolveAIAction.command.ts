import { cardLibrary } from "@/modules/cards/data/cards.data";
import { isHero } from "@/modules/figures/helpers/figures.helpers";
import { sleep } from "@/modules/shared/helpers/sleep";
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
	const draftAIFigures = draftUnits.filter((u) => !isHero(u));

	await tickStatusesAndSurfaces(get, set, isSimulation)(draftAIFigures);
	await sleep(isSimulation ? 0 : 200);

	// ==========================================
	// 2. EXECUTE ACTIONS
	// ==========================================
	const stateAfterTick = get();
	const allAIFigures = stateAfterTick.units.filter(
		(u) => !isHero(u) && u.currentHp > 0,
	);

	for (const aiFigure of allAIFigures) {
		const { units, aiIntents } = get();

		const freshAIFigure = units.find((u) => u.id === aiFigure.id);
		if (!freshAIFigure || freshAIFigure.currentHp <= 0) continue;

		const intent = aiIntents[freshAIFigure.id];
		if (!intent) continue;

		const cardToPlay = cardLibrary[intent.cardId];
		if (!cardToPlay) continue;

		await handleAICardIntent(
			get,
			set,
			isSimulation,
		)({
			attackerId: freshAIFigure.id,
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
		finalizeAction(get, set, draftUnits);
		await calculateAIIntents(get, set)({});
	}
};
