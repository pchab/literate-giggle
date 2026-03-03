import type { Hero, Monster } from "@/modules/figures/domain/figures.type";
import type { MonsterIntent } from "../../domain/attacks.type";
import {
	filterGridByAttackPattern,
	getActualTarget,
	getIdealTarget,
} from "../../helpers/ai.helpers";

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

			const { reachableTarget, moveDest } = getIdealTarget(
				monster,
				plannedAttack,
				heroes,
				simulatedMonsters,
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
