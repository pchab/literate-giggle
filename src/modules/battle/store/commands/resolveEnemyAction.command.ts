import { sleep } from "@/modules/shared/helpers/sleep";
import {
	handleMoveAndAttack,
	handleSummon,
} from "../../helpers/ai.actions.helpers";
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

		// Ensure monster is still alive before it acts
		const freshMonster = state.monsters.find((m) => m.id === currentMonster.id);
		if (!freshMonster || freshMonster.currentHp <= 0) continue;

		const intent = state.enemyIntents[freshMonster.id];
		if (!intent) continue;

		const { attackData: plannedAttack } = intent;

		// --- BRANCH: SUMMON ---
		if (plannedAttack.summonType) {
			const nextMonsters = handleSummon(state, freshMonster, plannedAttack);
			set((prev) => ({ ...prev, monsters: nextMonsters }));
			await sleep(800);
			continue;
		}

		// --- BRANCH: ATTACK ---
		const attackResult = handleMoveAndAttack(
			state,
			freshMonster,
			plannedAttack,
		);
		if (attackResult) {
			set((prev) => ({
				...prev,
				monsters: attackResult.nextMonsters,
				heroes: attackResult.nextHeroes,
			}));
			await sleep(800);
		}
	}

	// --- END OF TURN CLEANUP ---
	const finalState = get();
	const nextEnemyIntents = calculateAllIntents(
		finalState.heroes,
		finalState.monsters,
	);

	set((prev) => ({
		...prev,
		usedMovesThisTurn: {},
		usedCardsThisTurn: {},
		enemyIntents: nextEnemyIntents,
	}));
};
