import type { AnchorTarget, Card } from "@/modules/cards/domain/cards.type";
import { isSummon } from "@/modules/figures/helpers/figures.helpers";
import type {
	AIBattleUnit,
	BattleUnit,
} from "../../figures/domain/figures.type";
import type { GridPosition } from "../domain/grid.type";
import { areEnemies } from "./effects/effect.helpers";
import {
	getLineOfSightPath,
	getManhattanDistance,
	rotatePattern,
} from "./grid.helpers";
import { calculateExactPath } from "./move.helpers";

const calculateAIMove = <C extends AIBattleUnit, T extends BattleUnit>(
	monster: C,
	targetFigure: T,
	card: Card,
	figures: T[],
): GridPosition | null => {
	if (monster.baseMove === 0) {
		return monster.gridPosition;
	}

	const distance = getManhattanDistance(
		monster.gridPosition,
		targetFigure.gridPosition,
	);

	const canTargetSelf = card.playRequirement === "requires_ally";
	const minRange = canTargetSelf ? 0 : 1;

	if (distance >= minRange && distance <= card.range) {
		return monster.gridPosition;
	}

	const fullPath = calculateExactPath(
		monster.gridPosition,
		targetFigure.gridPosition,
		figures,
		minRange,
		card.range,
	);

	if (fullPath.length === 0) return null;

	const stepsToTake = Math.min(monster.baseMove, fullPath.length);
	return fullPath[stepsToTake - 1];
};

export const getIdealTarget = <C extends AIBattleUnit, T extends BattleUnit>(
	aiFigure: C,
	card: Card,
	figures: T[],
) => {
	if (card.aiTargetPreference === "self") {
		return {
			reachableTarget: aiFigure as C,
			moveDest: aiFigure.gridPosition,
			canHit: true,
		};
	}

	const targetsAllies = card.playRequirement === "requires_ally";
	const aliveOthers = figures.filter((f) => f.currentHp > 0);

	const validTargetsToEvaluate = aliveOthers
		.filter((f) => !isSummon(f) || f.allegiance !== "NEUTRAL")
		.filter((f) =>
			targetsAllies ? !areEnemies(aiFigure)(f) : areEnemies(aiFigure)(f),
		);

	const orderedTargets = getOrderedTargets<C, T>(
		aiFigure,
		card,
		validTargetsToEvaluate,
	);

	let fallbackMove: {
		reachableTarget: T;
		moveDest: GridPosition;
		canHit: boolean;
	} | null = null;
	for (const target of orderedTargets) {
		const moveDest = calculateAIMove(aiFigure, target, card, figures);
		if (moveDest) {
			const minRange = targetsAllies ? 0 : 1;
			const canHit = isTargetInRange(
				card,
				minRange,
				moveDest,
				target.gridPosition,
			);

			if (canHit) {
				return { reachableTarget: target, moveDest, canHit: true };
			}

			if (!fallbackMove) {
				fallbackMove = { reachableTarget: target, moveDest, canHit: false };
			}
		}
	}

	return (
		fallbackMove ?? {
			reachableTarget: null,
			moveDest: null,
			canHit: false,
		}
	);
};

export function getOrderedTargets<C extends AIBattleUnit, T extends BattleUnit>(
	aiFigure: C,
	card: Card,
	targets: T[],
): T[] {
	const sortFunction = (figureA: T, figureB: T) => {
		switch (card.aiTargetPreference) {
			case "lowestDef":
				return figureA.baseDef - figureB.baseDef;
			case "lowestHp":
				return figureA.currentHp - figureB.currentHp;
			case "random":
				return Math.random() - 0.5;
			default:
				return (
					getManhattanDistance(figureA.gridPosition, aiFigure.gridPosition) -
					getManhattanDistance(figureB.gridPosition, aiFigure.gridPosition)
				);
		}
	};
	return [...targets]
		.filter(({ currentHp }) => currentHp > 0)
		.sort(sortFunction);
}

export function isTargetInRange(
	card: Card,
	minRange: number,
	attackerPos: GridPosition,
	targetPos: GridPosition,
) {
	const distance = getManhattanDistance(attackerPos, targetPos);
	return distance >= minRange && distance <= card.range;
}

export function getActualTarget<T extends BattleUnit>(
	attackerPos: GridPosition,
	intendedTargetPos: GridPosition,
	figures: T[],
) {
	const flightPath = getLineOfSightPath(attackerPos, intendedTargetPos);

	for (let i = 1; i < flightPath.length; i++) {
		const tile = flightPath[i];
		const figureHit = figures.find(
			(f) =>
				f.gridPosition.col === tile.col &&
				f.gridPosition.row === tile.row &&
				f.currentHp > 0,
		);
		if (figureHit) return figureHit;
	}
	return null;
}

export function filterGridByAttackPattern(
	card: Card,
	targetPos: AnchorTarget,
	casterPos: GridPosition,
): GridPosition[] {
	const pattern = card.aoePattern || [{ col: 0, row: 0 }];
	if (!targetPos) return pattern;

	const rotatedPattern = rotatePattern(pattern, casterPos, targetPos);

	return rotatedPattern.map(({ col, row }) => ({
		col: targetPos.col + col,
		row: targetPos.row + row,
	}));
}
