import { cardLibrary } from "@/modules/cards/data/cards.data";
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
	const { monsters: draftMonsters, summons: draftSummons } = get();
	await tickStatusesAndSurfaces(
		get,
		set,
		isSimulation,
	)([...draftMonsters, ...draftSummons]);

	await sleep(isSimulation ? 0 : 200);

	// ==========================================
	// 2. EXECUTE ACTIONS
	// ==========================================
	const stateAfterTick = get();
	const heroSummons = stateAfterTick.summons.filter(
		(s) => s.allegiance === "PLAYER",
	);
	const monsterSummons = stateAfterTick.summons.filter(
		(s) => s.allegiance === "ENEMY",
	);
	const initialMonsters = stateAfterTick.monsters.filter(
		(m) => m.currentHp > 0,
	);

	const allAIFigures = [
		...heroSummons,
		...initialMonsters,
		...monsterSummons,
	].filter((f) => f.currentHp > 0);

	for (const aiFigure of allAIFigures) {
		const { heroes, monsters, summons, aiIntents } = get();

		const freshAIFigure = [...monsters, ...summons].find(
			(m) => m.id === aiFigure.id,
		);
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
			const previousFigures = [...heroes, ...monsters, ...summons];
			const {
				heroes: simulatedHeroes,
				monsters: simulatedMonsters,
				summons: simulatedSummons,
				aiIntents,
			} = get();
			const simulatedFigures = [
				...simulatedHeroes,
				...simulatedMonsters,
				...simulatedSummons,
			];
			const { projectedMoves, projectedCasualties } = calculateStateDiff(
				simulatedFigures,
				previousFigures,
			);
			const unitIntent = aiIntents[aiFigure.id];

			set((state) => ({
				...state,
				aiIntents: {
					...aiIntents,
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
	await tickStatusesAndSurfaces(get, set, isSimulation)(get().heroes);

	const xpEarnedThisTurn = calculateStateDiff(
		get().monsters,
		draftMonsters,
	).projectedCasualties.reduce(
		(xp, monsterId) =>
			xp + (draftMonsters.find(({ id }) => id === monsterId)?.xpReward ?? 0),
		0,
	);

	set(({ heroes, monsters, summons, xpEarned, ...prev }) => {
		const survivingHeroes = heroes.filter((h) => h.currentHp > 0);
		const survivingMonsters = monsters.filter((m) => m.currentHp > 0);
		const survivingSummons = summons.filter((s) => s.currentHp > 0);
		return {
			...prev,
			heroes: survivingHeroes,
			monsters: survivingMonsters,
			summons: survivingSummons,
			usedMovesThisTurn: {},
			usedCardsThisTurn: {},
			xpEarned: xpEarned + xpEarnedThisTurn,
		};
	});

	if (!isSimulation) {
		await calculateAIIntents(get, set)({});
	}
};
