import { sleep } from "@/modules/shared/helpers/sleep";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import { isHero, isIncapacitated } from "@/modules/units/helpers/units.helpers";
import { handleAICardIntent } from "../../helpers/ai.actions.helpers";
import { advancePattern } from "../../helpers/bossScript.helpers";
import { tickStatusesAndSurfaces } from "../../helpers/effects/effect.helpers";
import { finalizeAction } from "../../helpers/encounter.helpers";
import { triggerTurnStart } from "../../helpers/passive.helpers";
import type { BattleGet, BattleSet } from "../battle.store";
import { calculateAIIntents } from "./calculateAIIntents.command";

export const resolveAIActions = async (
	get: BattleGet,
	set: BattleSet,
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
	const { units: unitsAfterTick, sandboxCardOverride } = get();
	const allAIUnits = unitsAfterTick.filter(
		(u) => !isHero(u) && u.currentHp > 0,
	);

	for (const aiUnit of allAIUnits) {
		const { units, aiIntents } = get();

		const freshAIunit = units.find((u) => u.id === aiUnit.id);
		if (!freshAIunit || freshAIunit.currentHp <= 0) continue;

		// Frozen / stunned: lose the turn. Drop the intent so the UI doesn't show a fake threat.
		if (isIncapacitated(freshAIunit)) {
			set(({ aiIntents: { [freshAIunit.id]: _skipped, ...rest } }) => ({
				aiIntents: rest,
			}));
			continue;
		}

		const intent = aiIntents[freshAIunit.id];
		if (!intent) continue;

		const cardToPlay =
			sandboxCardOverride?.id === intent.cardId
				? sandboxCardOverride
				: useRegistryStore.getState().getCard(intent.cardId);
		if (!cardToPlay) continue;

		await handleAICardIntent(
			get,
			set,
			isSimulation,
		)({
			attackerId: freshAIunit.id,
			card: cardToPlay,
		});

		// Scripted bosses move on to the next card of their pattern.
		set(({ units }) => ({
			units: units.map((u) =>
				u.id === freshAIunit.id ? advancePattern(u) : u,
			),
		}));
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

	await triggerTurnStart(get, set, isSimulation)(get().units.filter(isHero));

	// Frozen / stunned heroes auto-pass their turn.
	const skippedHeroes = get().units.filter(
		(u) => isHero(u) && u.currentHp > 0 && isIncapacitated(u),
	);
	if (skippedHeroes.length > 0) {
		set(({ usedCardsThisTurn, usedMovesThisTurn }) => ({
			usedCardsThisTurn: {
				...usedCardsThisTurn,
				...Object.fromEntries(skippedHeroes.map((h) => [h.id, true])),
			},
			usedMovesThisTurn: {
				...usedMovesThisTurn,
				...Object.fromEntries(skippedHeroes.map((h) => [h.id, 99])),
			},
		}));
	}

	if (!isSimulation) {
		await finalizeAction(get, set, draftUnits);
		await calculateAIIntents(get, set)({});
	}
};
