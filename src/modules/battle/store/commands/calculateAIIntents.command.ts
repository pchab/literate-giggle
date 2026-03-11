import { cardLibrary } from "@/modules/cards/data/cards.data";
import type {
	AIBattleUnit,
	BattleUnit,
} from "@/modules/figures/domain/figures.type";
import { isMonster, isSummon } from "@/modules/figures/helpers/figures.helpers";
import type { AIIntent } from "../../domain/intent.type";
import {
	filterGridByAttackPattern,
	getActualTarget,
	getIdealTarget,
} from "../../helpers/ai.move.helpers";

export function calculateAIIntents(
	figures: BattleUnit[],
	existingIntents: Record<BattleUnit["id"], AIIntent> = {},
): Record<BattleUnit["id"], AIIntent> {
	const intents: Record<BattleUnit["id"], AIIntent> = {};

	let simulatedFigures: BattleUnit[] = [...figures];

	const aiFigures = simulatedFigures.filter(
		(f): f is AIBattleUnit => (isMonster(f) || isSummon(f)) && f.currentHp > 0,
	);

	for (const aiFigure of aiFigures) {
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
		if (!plannedCard) continue;

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
			continue;
		}

		const { reachableTarget, moveDest } = getIdealTarget(
			aiFigure,
			plannedCard,
			simulatedFigures,
		);

		if (!reachableTarget || !moveDest) continue;

		simulatedFigures = simulatedFigures.map((f) =>
			f.id === aiFigure.id ? { ...f, gridPosition: moveDest } : f,
		);

		const actualCollision = getActualTarget(
			moveDest,
			reachableTarget.gridPosition,
			simulatedFigures,
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
	}

	return intents;
}
