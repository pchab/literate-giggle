import { cardLibrary } from "@/modules/cards/data/cards.data";
import { sleep } from "@/modules/shared/helpers/sleep";
import { handleAICardIntent } from "../../helpers/ai.actions.helpers";
import type { BattleState } from "../battle.store";
import { calculateAllIntents } from "./calculateAllIntents.command";

export type StoreGet = () => BattleState;
export type StoreSet = (
	fn: (state: BattleState) => Partial<BattleState>,
) => void;

export const resolveAIActions = async (get: StoreGet, set: StoreSet) => {
	const heroSummons = get().summons.filter((s) => s.allegiance === "PLAYER");
	const monsterSummons = get().summons.filter((s) => s.allegiance === "ENEMY");
	const initialMonsters = get().monsters.filter((m) => m.currentHp > 0);

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
			await sleep(800);
		}
	}

	const finalState = get();
	const nextEnemyIntents = calculateAllIntents(
		finalState.heroes,
		finalState.monsters,
		finalState.summons,
	);

	set((prev) => ({
		...prev,
		usedMovesThisTurn: {},
		usedCardsThisTurn: {},
		aiIntents: nextEnemyIntents,
	}));
};
