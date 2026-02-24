import { calculateAIMove } from "@/modules/figures/ai.helpers";
import type { Hero, Monster } from "@/modules/figures/domain/figures.type";
import {
	filterGridByAttackPattern,
	findTargetedHero,
	getActualTarget,
	type MonsterIntent,
} from "../attacks";

export function calculateAllIntents(
	heroes: Hero[],
	monsters: Monster[],
): Record<string, MonsterIntent> {
	const intents: Record<string, MonsterIntent> = {};

	const simulatedMonsters = [...monsters];

	monsters
		.filter((m) => m.currentHp > 0)
		.forEach((monster, index) => {
			const plannedAttack =
				monster.attacks[Math.floor(Math.random() * monster.attacks.length)];
			const idealTarget = findTargetedHero(plannedAttack, heroes);

			const moveDest = calculateAIMove(
				monster,
				idealTarget,
				plannedAttack,
				heroes,
				simulatedMonsters,
			);

			simulatedMonsters[index] = { ...monster, gridPosition: moveDest };
			const actualCollision = getActualTarget(
				moveDest,
				idealTarget.gridPosition,
				heroes,
				simulatedMonsters,
			);
			const finalTargetPos = actualCollision
				? actualCollision.unit.gridPosition
				: idealTarget.gridPosition;
			const dangerTiles = filterGridByAttackPattern(
				plannedAttack,
				finalTargetPos,
			);

			intents[monster.id] = {
				monsterId: monster.id,
				targetHeroId: idealTarget.id,
				intendedMove: moveDest,
				dangerZone: dangerTiles,
				attackData: plannedAttack,
			};
		});

	return intents;
}
