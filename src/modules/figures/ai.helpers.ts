import { type Attack, getOrderedTargets } from "../attacks/attacks";
import {
	GRID_BOUNDS,
	getManhattanDistance,
	isTileOccupied,
} from "../grid/grid.helpers";
import type { GridPosition } from "../grid/grid.type";
import type { Hero, Monster } from "./domain/figures.type";

export const calculateAIMove = (
	monster: Monster,
	targetHero: Hero,
	plannedAttack: Attack,
	heroes: Hero[],
	monsters: Monster[],
): GridPosition | null => {
	if (plannedAttack.move === 0) {
		return monster.gridPosition;
	}
	const distance = getManhattanDistance(
		monster.gridPosition,
		targetHero.gridPosition,
	);
	if (
		distance >= plannedAttack.minRange &&
		distance <= plannedAttack.maxRange
	) {
		return monster.gridPosition;
	}

	const fullPath = calculatePathToTarget(
		monster.gridPosition,
		targetHero.gridPosition,
		plannedAttack,
		heroes,
		monsters,
	);

	if (fullPath.length === 0) return null;

	const stepsToTake = Math.min(plannedAttack.move, fullPath.length);
	return fullPath[stepsToTake - 1];
};

const calculatePathToTarget = (
	startPos: GridPosition,
	targetPos: GridPosition,
	attackData: Attack,
	heroes: Hero[],
	monsters: Monster[],
): GridPosition[] => {
	const queue: GridPosition[][] = [[startPos]];

	const visited = new Set<string>();
	visited.add(`${startPos.row},${startPos.col}`);

	while (queue.length > 0) {
		const currentPath = queue.shift();
		if (!currentPath) return [];
		const currentPos = currentPath[currentPath.length - 1];

		const distToTarget = getManhattanDistance(currentPos, targetPos);
		if (
			distToTarget >= attackData.minRange &&
			distToTarget <= attackData.maxRange
		) {
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

				if (visited.has(key)) {
					return;
				}
				const isTargetTile =
					next.row === targetPos.row && next.col === targetPos.col;
				if (!isTargetTile && isTileOccupied(next, [...heroes, ...monsters])) {
					return;
				}
				visited.add(key);
				queue.push([...currentPath, next]);
			});
	}

	return [];
};

export const getReachableTarget = (
	monster: Monster,
	plannedAttack: Attack,
	heroes: Hero[],
	monsters: Monster[],
) => {
	const orderedTargets = getOrderedTargets(plannedAttack, heroes);

	return orderedTargets.reduce(
		(acc, hero) => {
			if (acc.moveDest) return acc;
			const moveDest = calculateAIMove(
				monster,
				hero,
				plannedAttack,
				heroes,
				monsters,
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
};
