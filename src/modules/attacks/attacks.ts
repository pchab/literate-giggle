import type { Hero, Monster } from "../figures/domain/figures.type";
import { getLineOfSightPath } from "../grid/grid.helpers";
import type { GridPosition } from "../grid/grid.type";

type Target = "lowestHp" | "random" | "lowestDef" | "grid";
export type Attack = {
	id: number;
	target: Target;
	pattern: GridPosition[];
	move: number;
	damage: number;
	minRange: number;
	maxRange: number;
};

export const singleTargetPattern: GridPosition[] = [{ col: 0, row: 0 }];

export const crossPattern: GridPosition[] = [
	{ col: 0, row: -1 },
	{ col: -1, row: 0 },
	{ col: 0, row: 0 },
	{ col: 1, row: 0 },
	{ col: 0, row: 1 },
];

export const linePattern: GridPosition[] = [
	{ col: -2, row: 0 },
	{ col: -1, row: 0 },
	{ col: 0, row: 0 },
	{ col: 1, row: 0 },
	{ col: 2, row: 0 },
];

export const conePattern: GridPosition[] = [
	{ row: 0, col: 0 },
	{ row: -1, col: -1 },
	{ row: -1, col: 0 },
	{ row: -1, col: 1 },
	{ row: -2, col: -2 },
	{ row: -2, col: -1 },
	{ row: -2, col: 0 },
	{ row: -2, col: 1 },
	{ row: -2, col: 2 },
];

export type MonsterIntent = {
	monsterId: Monster["id"];
	targetHeroId: Hero["id"] | null;
	intendedMove: GridPosition;
	dangerZone: GridPosition[];
	attackData: Attack;
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
