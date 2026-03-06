import { cardLibrary } from "@/modules/cards/data/cards.data";
import type {
	Hero,
	Monster,
	Summon,
} from "@/modules/figures/domain/figures.type";
import type { MonsterIntent } from "../../domain/intent.type";
import {
	filterGridByAttackPattern,
	getActualTarget,
	getIdealTarget,
} from "../../helpers/ai.move.helpers";

export function calculateAllIntents(
	heroes: Hero[],
	monsters: Monster[],
	summons: Summon[],
	existingIntents: Record<Monster["id"], MonsterIntent> = {},
): Record<Monster["id"], MonsterIntent> {
	const intents: Record<Monster["id"], MonsterIntent> = {};
	const simulatedMonsters = [...monsters];

	const playerAlignedTargets = [
		...heroes,
		...summons.filter((s) => s.allegiance === "PLAYER"),
	];

	const enemyAlignedObstacles = [
		...simulatedMonsters,
		...summons.filter((s) => s.allegiance === "ENEMY"),
	];

	monsters
		.filter((m) => m.currentHp > 0)
		.forEach((monster) => {
			let selectedCardId = existingIntents[monster.id]?.cardId;

			if (!selectedCardId) {
				console.log("selecting new card for monster", monster.id);
				const totalWeight = monster.intentPool.reduce(
					(sum, intent) => sum + intent.weight,
					0,
				);
				let randomNum = Math.random() * totalWeight;
				selectedCardId = monster.intentPool[0].cardId;

				for (const intent of monster.intentPool) {
					randomNum -= intent.weight;
					if (randomNum <= 0) {
						selectedCardId = intent.cardId;
						break;
					}
				}
				console.log(`selected card ${selectedCardId} for monster ${monster.id}`);
			}

			const plannedCard = cardLibrary[selectedCardId];
			if (!plannedCard) return;

			if (plannedCard.aiTargetPreference === "self") {
				intents[monster.id] = {
					monsterId: monster.id,
					targetId: monster.id,
					intendedMove: monster.gridPosition,
					dangerZone: filterGridByAttackPattern(plannedCard, monster.gridPosition),
					cardId: plannedCard.id,
				};
				return;
			}

			const { reachableTarget, moveDest } = getIdealTarget(
				monster,
				plannedCard,
				playerAlignedTargets as Hero[],
				enemyAlignedObstacles as Monster[],
			);

			if (!reachableTarget || !moveDest) return;

			const index = simulatedMonsters.findIndex((m) => m.id === monster.id);
			simulatedMonsters[index] = { ...monster, gridPosition: moveDest };

			const actualCollision = getActualTarget(
				moveDest,
				reachableTarget.gridPosition,
				[...playerAlignedTargets, ...enemyAlignedObstacles],
			);

			const finalTargetPos = actualCollision
				? actualCollision.gridPosition
				: reachableTarget.gridPosition;

			const dangerTiles = filterGridByAttackPattern(
				plannedCard,
				finalTargetPos,
			);

			intents[monster.id] = {
				monsterId: monster.id,
				targetId: reachableTarget.id,
				intendedMove: moveDest,
				dangerZone: dangerTiles,
				cardId: plannedCard.id,
			};
		});

	return intents;
}
