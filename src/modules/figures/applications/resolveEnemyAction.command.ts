import { intentService } from "@/modules/attacks/intents.service";
import type { BattleState } from "@/store/battle.store"; // <-- Import your actual state interface!
import {
	filterGridByAttackPattern,
	findTargetedHero,
	getActualTarget,
} from "../../attacks/attacks";

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

		const { intendedMove, attackData: plannedAttack } = intent;

		const nextMonsters = state.monsters.map((m) =>
			m.id === freshMonster.id ? { ...m, gridPosition: intendedMove } : m,
		);

		// biome-ignore lint/style/noNonNullAssertion: <We just mapped it on the line above>
		const movedMonster = nextMonsters.find((m) => m.id === freshMonster.id)!;

		const idealTarget = findTargetedHero(plannedAttack, state.heroes);
		const collision = getActualTarget(
			movedMonster.gridPosition,
			idealTarget.gridPosition,
			state.heroes,
			nextMonsters,
		);

		const finalTargetPos = collision
			? collision.unit.gridPosition
			: idealTarget.gridPosition;
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
	const nextEnemyIntents = intentService.calculateAllIntents(
		finalState.heroes,
		finalState.monsters,
	);

	set((prev) => ({
		...prev,
		usedCardsThisTurn: {},
		enemyIntents: nextEnemyIntents,
	}));
};
