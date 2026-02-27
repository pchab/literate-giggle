import { calculateAIMove } from "@/modules/figures/ai.helpers";
import type { Hero, Monster } from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "@/modules/grid/grid.type";
import {
	filterGridByAttackPattern,
	getActualTarget,
	getOrderedTargets,
	type MonsterIntent,
} from "../attacks";

export function calculateAllIntents(
	heroes: Hero[],
	monsters: Monster[],
): Record<Monster["id"], MonsterIntent> {
	const intents: Record<Monster["id"], MonsterIntent> = {};

	const simulatedMonsters = [...monsters];

	monsters
		.filter((m) => m.currentHp > 0)
		.forEach((monster, index) => {
			const plannedAttack =
				monster.attacks[Math.floor(Math.random() * monster.attacks.length)];
			const orderedTargets = getOrderedTargets(plannedAttack, heroes);

			const { reachableTarget, moveDest } = orderedTargets.reduce(
				(acc, hero) => {
					if (acc.moveDest) return acc;
					const moveDest = calculateAIMove(
						monster,
						hero,
						plannedAttack,
						heroes,
						simulatedMonsters,
					);
					if (moveDest) {
						return { reachableTarget: hero, moveDest };
					}
					return acc;
				},
				{
					reachableTarget: null as Hero | null,
					moveDest: null as GridPosition | null,
				},
			);
			if (!reachableTarget || !moveDest) {
				return;
			}

			simulatedMonsters[index] = { ...monster, gridPosition: moveDest };
			const actualCollision = getActualTarget(
				moveDest,
				reachableTarget.gridPosition,
				heroes,
				simulatedMonsters,
			);
			const finalTargetPos = actualCollision
				? actualCollision.unit.gridPosition
				: reachableTarget.gridPosition;
			const dangerTiles = filterGridByAttackPattern(
				plannedAttack,
				finalTargetPos,
			);

			intents[monster.id] = {
				monsterId: monster.id,
				targetHeroId: reachableTarget.id,
				intendedMove: moveDest,
				dangerZone: dangerTiles,
				attackData: plannedAttack,
			};
		});

	return intents;
}
