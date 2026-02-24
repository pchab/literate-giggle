import { intentService } from "@/modules/attacks/intents.service";
import type { BattleStoreServerAction } from "@/store/battle.store";
import {
	filterGridByAttackPattern,
	findTargetedHero,
	getActualTarget,
} from "../../attacks/attacks";

export function enemyAction(): BattleStoreServerAction {
	return ({ monsters, heroes, enemyIntents }) => {
		const nextMonsters = monsters
			.filter((m) => m.currentHp > 0)
			.map((m) => {
				const { intendedMove } = enemyIntents[m.id];
				return {
					...m,
					gridPosition: intendedMove,
				};
			});

		const nextHeroes = nextMonsters.reduce((acc, currentMonster) => {
			const plannedAttack = enemyIntents[currentMonster.id].attackData;

			const idealTarget = findTargetedHero(plannedAttack, acc);

			const collision = getActualTarget(
				currentMonster.gridPosition,
				idealTarget.gridPosition,
				acc,
				nextMonsters,
			);

			const finalTargetPos = collision
				? collision.unit.gridPosition
				: idealTarget.gridPosition;

			const targetedCells = filterGridByAttackPattern(
				plannedAttack,
				finalTargetPos,
			);

			return acc.map((hero) => {
				const isTargeted = targetedCells.some(
					({ col, row }) =>
						col === hero.gridPosition.col && row === hero.gridPosition.row,
				);

				if (!isTargeted) return hero;

				const effectiveDmg =
					plannedAttack.effect === "physDmg"
						? Math.max(0, plannedAttack.damage - hero.physDef)
						: Math.max(0, plannedAttack.damage - hero.magDef);

				const hpDamage =
					plannedAttack.effect === "physDmg"
						? Math.max(0, effectiveDmg - hero.currentPhysBlock)
						: Math.max(0, effectiveDmg - hero.currentMagBlock);

				const newPhysBlock =
					plannedAttack.effect === "physDmg"
						? Math.max(0, hero.currentPhysBlock - effectiveDmg)
						: hero.currentPhysBlock;

				const newMagBlock =
					plannedAttack.effect === "magDmg"
						? Math.max(0, hero.currentMagBlock - effectiveDmg)
						: hero.currentMagBlock;

				return {
					...hero,
					currentHp: Math.max(0, hero.currentHp - hpDamage),
					currentPhysBlock: newPhysBlock,
					currentMagBlock: newMagBlock,
				};
			});
		}, heroes);

		const nextEnemyIntents = intentService.calculateAllIntents(
			nextHeroes,
			nextMonsters,
		);
		return {
			monsters: nextMonsters,
			heroes: nextHeroes,
			usedCardsThisTurn: {},
			enemyIntents: nextEnemyIntents,
		};
	};
}
