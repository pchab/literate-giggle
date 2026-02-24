import { calculateAIMove } from "@/modules/figures/ai.helpers";
import type { Hero, Monster } from "@/modules/figures/domain/figures.type";
import {
	filterGridByAttackPattern,
	findTargetedHero,
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
			const target = findTargetedHero(plannedAttack, heroes);

			const moveDest = calculateAIMove(
				monster,
				plannedAttack,
				heroes,
				simulatedMonsters,
			);

			simulatedMonsters[index] = { ...monster, gridPosition: moveDest };

			const dangerTiles = filterGridByAttackPattern(plannedAttack, heroes);

			intents[monster.id] = {
				monsterId: monster.id,
				targetHeroId: target.id,
				intendedMove: moveDest,
				dangerZone: dangerTiles,
				attackData: plannedAttack,
			};
		});

	return intents;
}
