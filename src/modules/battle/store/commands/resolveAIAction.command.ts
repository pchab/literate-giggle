import { cardLibrary } from "@/modules/cards/data/cards.data";
import { sleep } from "@/modules/shared/helpers/sleep";
import { handleAICardIntent } from "../../helpers/ai.actions.helpers";
import { tickStatuses } from "../../helpers/effect.helpers";
import type { BattleState } from "../battle.store";
import { calculateAllIntents } from "./calculateAllIntents.command";

export type StoreGet = () => BattleState;
export type StoreSet = (
	fn: (state: BattleState) => Partial<BattleState>,
) => void;

export const resolveAIActions = async (get: StoreGet, set: StoreSet) => {
	// ==========================================
	// 1. START OF AI TURN (Tick AI statuses)
	// ==========================================
	set((prev) => ({
		...prev,
		monsters: tickStatuses(prev.monsters),
		summons: tickStatuses(prev.summons),
	}));

	await sleep(500);

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
		const state = get();

		const freshAIFigure = [...state.monsters, ...state.summons].find(
			(m) => m.id === aiFigure.id,
		);
		if (!freshAIFigure || freshAIFigure.currentHp <= 0) continue;

		const intent = state.aiIntents[freshAIFigure.id];
		if (!intent) continue;

		const cardToPlay = cardLibrary[intent.cardId];
		if (!cardToPlay) continue;

		const actionResult = handleAICardIntent(state, freshAIFigure, cardToPlay);

		if (actionResult) {
			set((prev) => ({
				...prev,
				monsters: actionResult.nextMonsters,
				heroes: actionResult.nextHeroes,
				summons: actionResult.nextSummons,
				currentVfx: actionResult.nextVfx,
			}));
			await sleep(300);
		}
	}

	// ==========================================
	// 3. START OF PLAYER TURN (Tick Hero statuses)
	// ==========================================
	const finalState = get();

	const nextHeroes = tickStatuses(finalState.heroes);

	const survivingMonsters = finalState.monsters.filter((m) => m.currentHp > 0);
	const survivingSummons = finalState.summons.filter((s) => s.currentHp > 0);

	const nextEnemyIntents = calculateAllIntents(
		nextHeroes,
		survivingMonsters,
		survivingSummons,
	);

	set((prev) => ({
		...prev,
		heroes: nextHeroes,
		monsters: survivingMonsters,
		summons: survivingSummons,
		usedMovesThisTurn: {},
		usedCardsThisTurn: {},
		aiIntents: nextEnemyIntents,
	}));
};
