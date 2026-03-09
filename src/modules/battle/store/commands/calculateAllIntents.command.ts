import { cardLibrary } from "@/modules/cards/data/cards.data";
import type {
	BattleHero,
	BattleUnit,
	Monster,
	Summon,
} from "@/modules/figures/domain/figures.type";
import { isMonster, isSummon } from "@/modules/figures/helpers/figures.helpers";
import type { AIIntent } from "../../domain/intent.type";
import {
	filterGridByAttackPattern,
	getActualTarget,
	getIdealTarget,
} from "../../helpers/ai.move.helpers";

export function calculateAllIntents(
	heroes: BattleHero[],
	monsters: Monster[],
	summons: Summon[],
	existingIntents: Record<BattleUnit["id"], AIIntent> = {},
): Record<BattleUnit["id"], AIIntent> {
	const intents: Record<BattleUnit["id"], AIIntent> = {};
	const simulatedMonsters = [...monsters];
	const simulatedSummons = [...summons];
	const heroAlignedSummons = simulatedSummons.filter(
		(s) => s.allegiance === "PLAYER",
	);
	const monsterAlignedSummons = simulatedSummons.filter(
		(s) => s.allegiance === "ENEMY",
	);

	const allFigures = [
		...heroes,
		...heroAlignedSummons,
		...simulatedMonsters,
		...monsterAlignedSummons,
	];

	[...heroAlignedSummons, ...monsters, ...monsterAlignedSummons]
		.filter((m) => m.currentHp > 0)
		.forEach((aiFigure) => {
			let selectedCardId = existingIntents[aiFigure.id]?.cardId;

			if (!selectedCardId) {
				const totalWeight = aiFigure.intentPool.reduce(
					(sum, intent) => sum + intent.weight,
					0,
				);
				let randomNum = Math.random() * totalWeight;
				selectedCardId = aiFigure.intentPool[0].cardId;

				for (const intent of aiFigure.intentPool) {
					randomNum -= intent.weight;
					if (randomNum <= 0) {
						selectedCardId = intent.cardId;
						break;
					}
				}
			}

			const plannedCard = cardLibrary[selectedCardId];
			if (!plannedCard) {
				console.warn(`Missing card data for cardId: ${selectedCardId}`);
				return;
			}

			if (plannedCard.aiTargetPreference === "self") {
				intents[aiFigure.id] = {
					figureId: aiFigure.id,
					targetId: aiFigure.id,
					intendedMove: aiFigure.gridPosition,
					dangerZone: filterGridByAttackPattern(
						plannedCard,
						aiFigure.gridPosition,
						aiFigure.gridPosition,
					),
					cardId: plannedCard.id,
				};
				return;
			}

			const { reachableTarget, moveDest } = getIdealTarget(
				aiFigure,
				plannedCard,
				allFigures,
			);

			if (!reachableTarget || !moveDest) return;

			if (isMonster(aiFigure)) {
				const index = simulatedMonsters.findIndex((m) => m.id === aiFigure.id);
				simulatedMonsters[index] = { ...aiFigure, gridPosition: moveDest };
			}
			if (isSummon(aiFigure)) {
				const index = simulatedSummons.findIndex((s) => s.id === aiFigure.id);
				simulatedSummons[index] = { ...aiFigure, gridPosition: moveDest };
			}

			const actualCollision = getActualTarget(
				moveDest,
				reachableTarget.gridPosition,
				allFigures,
			);

			const finalTargetPos = actualCollision
				? actualCollision.gridPosition
				: reachableTarget.gridPosition;

			const dangerTiles = filterGridByAttackPattern(
				plannedCard,
				finalTargetPos,
				moveDest,
			);

			intents[aiFigure.id] = {
				figureId: aiFigure.id,
				targetId: reachableTarget.id,
				intendedMove: moveDest,
				dangerZone: dangerTiles,
				cardId: plannedCard.id,
			};
		});

	return intents;
}
