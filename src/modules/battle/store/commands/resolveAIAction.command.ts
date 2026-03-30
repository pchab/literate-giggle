import { cardLibrary } from "@/modules/cards/data/cards.data";
import { isHero, isMonster } from "@/modules/figures/helpers/figures.helpers";
import { sleep } from "@/modules/shared/helpers/sleep";
import { handleAICardIntent } from "../../helpers/ai.actions.helpers";
import { tickStatusesAndSurfaces } from "../../helpers/effects/effect.helpers";
import { calculateStateDiff } from "../../helpers/state.helpers";
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

		if (isSimulation) {
			const previousFigures = units;
			const { units: simulatedUnits, aiIntents: currentAiIntents } = get();

			const { projectedMoves, projectedCasualties } = calculateStateDiff(
				simulatedUnits,
				previousFigures,
			);
			const unitIntent = currentAiIntents[aiFigure.id];

			set((state) => ({
				...state,
				aiIntents: {
					...currentAiIntents,
					[aiFigure.id]: {
						...unitIntent,
						projectedMoves,
						projectedCasualties,
					},
				},
			}));
		}
	}

	// ============================================
	// 3. START OF PLAYER TURN (Tick Hero statuses)
	// ============================================
	const { units: currentUnits } = get();
	const heroes = currentUnits.filter(isHero);

	await tickStatusesAndSurfaces(get, set, isSimulation)(heroes);

	const draftMonsters = draftUnits.filter(isMonster);
	const currentMonsters = get().units.filter(isMonster);

	const xpEarnedThisTurn = calculateStateDiff(
		currentMonsters,
		draftMonsters,
	).projectedCasualties.reduce((xp, monsterId) => {
		const monster = draftMonsters.find(({ id }) => id === monsterId);
		return xp + (monster?.xpReward ?? 0);
	}, 0);

	set(({ units, xpEarned, ...prev }) => {
		const survivingUnits = units.filter((u) => u.currentHp > 0);

		return {
			...prev,
			units: survivingUnits,
			usedMovesThisTurn: {},
			usedCardsThisTurn: {},
			xpEarned: xpEarned + xpEarnedThisTurn,
		};
	});

	if (!isSimulation) {
		await calculateAIIntents(get, set)({});
	}
};
