import type { Hero, Monster } from "../../figures/domain/figures.type";
import type { Attack } from "../domain/attacks.type";
import type { GridPosition } from "../domain/grid.type";
import {
	GRID_BOUNDS,
	getLineOfSightPath,
	getManhattanDistance,
	isTileOccupied,
} from "./grid.helpers";

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

export const getIdealTarget = (
	monster: Monster,
	plannedAttack: Attack,
	heroes: Hero[],
	monsters: Monster[],
) => {
	const orderedTargets = getOrderedTargets(plannedAttack, heroes);

	return orderedTargets.reduce(
		(acc, hero) => {
			if (acc.moveDest && acc.canHit) return acc;
			const moveDest = calculateAIMove(
				monster,
				hero,
				plannedAttack,
				heroes,
				monsters,
			);
			if (moveDest) {
				const canHit = isTargetInRange(
					plannedAttack,
					moveDest,
					hero.gridPosition,
				);
				return canHit
					? { reachableTarget: hero, moveDest, canHit }
					: moveDest
						? { reachableTarget: hero, moveDest, canHit }
						: acc;
			}
			return acc;
		},
		{
			reachableTarget: null as Hero | null,
			moveDest: null as GridPosition | null,
			canHit: false,
		},
	);
};

export function getOrderedTargets(attack: Attack, heroes: Hero[]): Hero[] {
	const { target } = attack;
	const sortFunction = (heroA: Hero, heroB: Hero) => {
		switch (target) {
			case "lowestDef":
				return heroA.baseDef - heroB.baseDef;
			case "lowestHp":
				return heroA.currentHp - heroB.currentHp;
			default:
				return Math.random() < 0.5 ? -1 : 1;
		}
	};
	return [...heroes]
		.filter(({ currentHp }) => currentHp > 0)
		.sort(sortFunction);
}

export function isTargetInRange(
	attack: Attack,
	attackerPos: GridPosition,
	targetPos: GridPosition,
) {
	const distance = getManhattanDistance(attackerPos, targetPos);
	return distance >= attack.minRange && distance <= attack.maxRange;
}

export function getActualTarget(
	attackerPos: GridPosition,
	intendedTargetPos: GridPosition,
	heroes: Hero[],
	monsters: Monster[],
): { type: "hero"; unit: Hero } | { type: "monster"; unit: Monster } | null {
	const flightPath = getLineOfSightPath(attackerPos, intendedTargetPos);

	// Start at i = 1 to skip the tile the Attacker is standing on!
	for (let i = 1; i < flightPath.length; i++) {
		const tile = flightPath[i];

		// Did it hit a Hero?
		const heroHit = heroes.find(
			(h) =>
				h.gridPosition.col === tile.col &&
				h.gridPosition.row === tile.row &&
				h.currentHp > 0,
		);
		if (heroHit) return { type: "hero", unit: heroHit };

		// Did it hit a Monster? (Friendly fire is a great mechanic)
		const monsterHit = monsters.find(
			(m) =>
				m.gridPosition.col === tile.col &&
				m.gridPosition.row === tile.row &&
				m.currentHp > 0,
		);
		if (monsterHit) return { type: "monster", unit: monsterHit };
	}

	return null; // Arrow flew perfectly to the intended empty tile
}

export function filterGridByAttackPattern(
	attack: Attack,
	targetPos: GridPosition,
): GridPosition[] {
	const { target, pattern } = attack;
	if (target === "grid") {
		return pattern;
	}
	return pattern.map(({ col, row }) => ({
		col: targetPos.col + col,
		row: targetPos.row + row,
	}));
}
