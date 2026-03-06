import type { Card } from "@/modules/cards/domain/cards.type";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";
import type {
	Figure,
	Monster,
	Summon,
} from "../../figures/domain/figures.type";
import type { GridPosition } from "../domain/grid.type";
import {
	GRID_BOUNDS,
	getLineOfSightPath,
	getManhattanDistance,
	isTileOccupied,
	rotatePattern,
} from "./grid.helpers";

export const calculateAIMove = <T extends Figure>(
	monster: Monster | Summon,
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

	const minRange = 1;

	if (distance >= minRange && distance <= card.range) {
		return monster.gridPosition;
	}

	const fullPath = calculatePathToTarget(
		monster.gridPosition,
		targetFigure.gridPosition,
		card,
		minRange,
		figures,
	);

	if (fullPath.length === 0) return null;

	const stepsToTake = Math.min(monster.baseMove, fullPath.length);
	return fullPath[stepsToTake - 1];
};

const calculatePathToTarget = <T extends Figure>(
	startPos: GridPosition,
	targetPos: GridPosition,
	card: Card,
	minRange: number,
	figures: T[],
): GridPosition[] => {
	const queue: GridPosition[][] = [[startPos]];
	const visited = new Set<string>();
	visited.add(`${startPos.row},${startPos.col}`);

	while (queue.length > 0) {
		const currentPath = queue.shift();
		if (!currentPath) return [];
		const currentPos = currentPath[currentPath.length - 1];

		const distToTarget = getManhattanDistance(currentPos, targetPos);
		if (distToTarget >= minRange && distToTarget <= card.range) {
			return currentPath.slice(1);
		}

		[
			{ row: currentPos.row - 1, col: currentPos.col },
			{ row: currentPos.row + 1, col: currentPos.col },
			{ row: currentPos.row, col: currentPos.col - 1 },
			{ row: currentPos.row, col: currentPos.col + 1 },
		]
			.filter(({ row, col }) => {
				return (
					row >= 0 &&
					row < GRID_BOUNDS.rows &&
					col >= 0 &&
					col < GRID_BOUNDS.cols
				);
			})
			.forEach((next) => {
				const key = `${next.row},${next.col}`;
				if (visited.has(key)) return;

				const isTargetTile =
					next.row === targetPos.row && next.col === targetPos.col;
				if (!isTargetTile && isTileOccupied(next, figures)) {
					return;
				}
				visited.add(key);
				queue.push([...currentPath, next]);
			});
	}
	return [];
};

export const getIdealTarget = <T extends Figure>(
	aiFigure: Monster | Summon,
	card: Card,
	figures: T[],
) => {
	if (card.aiTargetPreference === "self") {
		return {
			reachableTarget: aiFigure,
			moveDest: aiFigure.gridPosition,
			canHit: true,
		};
	}

	const isPlayerAligned =
		isSummon(aiFigure) && aiFigure.allegiance === "PLAYER";
	const heroes = figures.filter((f) => isHero(f));
	const monsters = figures.filter((f) => isMonster(f));
	const summons = figures.filter((f) => isSummon(f));
	const heroAlignedSummons = summons.filter((s) => s.allegiance === "PLAYER");
	const monsterAlignedSummons = summons.filter((s) => s.allegiance === "ENEMY");
	const playerAlignedTargets = [...heroes, ...heroAlignedSummons];
	const enemyAlignedObstacles = [...monsters, ...monsterAlignedSummons];
	const enemyFaction = isPlayerAligned
		? enemyAlignedObstacles
		: playerAlignedTargets;

	const allyFaction = isPlayerAligned
		? playerAlignedTargets
		: enemyAlignedObstacles;

	const targetsAllies =
		card.playRequirement === "requires_ally" ||
		card.playRequirement === "requires_ally_or_self";

	const validTargetsToEvaluate = targetsAllies ? allyFaction : enemyFaction;
	const obstaclesToAvoid = targetsAllies ? enemyFaction : allyFaction;

	const orderedTargets = getOrderedTargets<T>(
		aiFigure,
		card,
		validTargetsToEvaluate,
	);

	return orderedTargets.reduce(
		(acc, figure) => {
			if (acc.moveDest && acc.canHit) return acc;

			const moveDest = calculateAIMove(aiFigure, figure, card, [
				...validTargetsToEvaluate,
				...obstaclesToAvoid,
			]);

			if (moveDest) {
				const minRange = 1;
				const canHit = isTargetInRange(
					card,
					minRange,
					moveDest,
					figure.gridPosition,
				);
				return canHit
					? { reachableTarget: figure, moveDest, canHit }
					: moveDest
						? { reachableTarget: figure, moveDest, canHit }
						: acc;
			}
			return acc;
		},
		{
			reachableTarget: null as T | null,
			moveDest: null as GridPosition | null,
			canHit: false,
		},
	);
};

export function getOrderedTargets<T extends Figure>(
	aiFigure: Monster | Summon,
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

export function getActualTarget<T extends Figure>(
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
	targetPos: GridPosition,
	casterPos: GridPosition,
): GridPosition[] {
	const pattern = card.aoePattern || [{ col: 0, row: 0 }];

	const rotatedPattern = rotatePattern(pattern, casterPos, targetPos);

	return rotatedPattern.map(({ col, row }) => ({
		col: targetPos.col + col,
		row: targetPos.row + row,
	}));
}
