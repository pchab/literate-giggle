import { cardLibrary } from "@/modules/cards/data/cards.data";
import { sleep } from "@/modules/shared/helpers/sleep";
import { handleCardIntent } from "../../helpers/ai.actions.helpers";
import type { BattleState } from "../battle.store";
import { calculateAllIntents } from "./calculateAllIntents.command";

export type StoreGet = () => BattleState;
export type StoreSet = (
	fn: (state: BattleState) => Partial<BattleState>,
) => void;

export const resolveEnemyActions = async (get: StoreGet, set: StoreSet) => {
	const initialMonsters = get().monsters.filter((m) => m.currentHp > 0);

	for (const currentMonster of initialMonsters) {
		const state = get();

		const freshMonster = state.monsters.find((m) => m.id === currentMonster.id);
		if (!freshMonster || freshMonster.currentHp <= 0) continue;

		const intent = state.enemyIntents[freshMonster.id];
		if (!intent) continue;

		const cardToPlay = cardLibrary[intent.cardId];
		if (!cardToPlay) continue;

		const actionResult = handleCardIntent(state, freshMonster, cardToPlay);

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
		enemyIntents: nextEnemyIntents,
	}));
};
