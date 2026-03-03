import { getManhattanDistance } from "@/modules/battle/helpers/grid.helpers";
import type { BattleState } from "@/modules/battle/store/battle.store";
import {
	filterGridByAttackPattern,
	getActualTarget,
	getIdealTarget,
} from "../../helpers/ai.helpers";
import { calculateAllIntents } from "./calculateAllIntents.command";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

		const { attackData: plannedAttack } = intent;
		const { reachableTarget, moveDest } = getIdealTarget(
			freshMonster,
			plannedAttack,
			state.heroes,
			state.monsters,
		);
		if (!reachableTarget || !moveDest) {
			continue;
		}

		const nextMonsters = state.monsters.map((m) =>
			m.id === freshMonster.id ? { ...m, gridPosition: moveDest } : m,
		);

		// biome-ignore lint/style/noNonNullAssertion: <We just mapped it on the line above>
		const movedMonster = nextMonsters.find((m) => m.id === freshMonster.id)!;

		const distanceToTarget = getManhattanDistance(
			movedMonster.gridPosition,
			reachableTarget.gridPosition,
		);
		if (
			distanceToTarget < plannedAttack.minRange ||
			distanceToTarget > plannedAttack.maxRange
		) {
			// Cannot attack, store move
			set((prev) => ({
				...prev,
				monsters: nextMonsters,
			}));
			continue;
		}

		const collision = getActualTarget(
			movedMonster.gridPosition,
			reachableTarget.gridPosition,
			state.heroes,
			nextMonsters,
		);

		const finalTargetPos = collision
			? collision.unit.gridPosition
			: reachableTarget.gridPosition;
		const targetedCells = filterGridByAttackPattern(
			plannedAttack,
			finalTargetPos,
		);

		const nextHeroes = state.heroes.map((hero) => {
			const isTargeted = targetedCells.some(
				({ col, row }) =>
					col === hero.gridPosition.col && row === hero.gridPosition.row,
			);

			if (!isTargeted) return hero;

			const effectiveDmg = Math.max(0, plannedAttack.damage - hero.baseDef);

			const hpDamage = Math.max(0, effectiveDmg - hero.currentBlock);
			const newBlock = Math.max(0, hero.currentBlock - effectiveDmg);

			return {
				...hero,
				currentHp: Math.max(0, hero.currentHp - hpDamage),
				currentBlock: newBlock,
			};
		});

		set((prev) => ({
			...prev,
			monsters: nextMonsters,
			heroes: nextHeroes,
		}));

		await sleep(800);
	}

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
