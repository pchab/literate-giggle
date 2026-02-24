import type { Hero } from "../figures/domain/figures.type";
import type { GridPosition } from "../grid/grid.type";

type Target = "lowestHp" | "random" | "lowestPhysDef" | "lowestMagDef" | "grid";
export type Attack = {
	id: number;
	target: Target;
	pattern: GridPosition[];
	move: number;
	damage: number;
	minRange: number;
	maxRange: number;
	effect: "physDmg" | "magDmg";
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
	monsterId: number;
	targetHeroId: number | null;
	intendedMove: GridPosition;
	dangerZone: GridPosition[];
	attackData: Attack;
};

export function findTargetedHero(attack: Attack, heroes: Hero[]): Hero {
	const { target } = attack;
	const reduceFunction = (hero: Hero, currentTarget: Hero) => {
		switch (target) {
			case "lowestPhysDef":
				return hero.physDef < currentTarget.physDef ? hero : currentTarget;
			case "lowestMagDef":
				return hero.magDef < currentTarget.magDef ? hero : currentTarget;
			case "lowestHp":
				return hero.currentHp < currentTarget.currentHp ? hero : currentTarget;
			default:
				return Math.random() < 0.5 ? hero : currentTarget;
		}
	};
	return heroes.reduce(reduceFunction);
}
export function filterGridByAttackPattern(
	attack: Attack,
	heroes: Hero[],
): GridPosition[] {
	const { target, pattern } = attack;
	if (target === "grid") {
		return pattern;
	}
	const targetedHero = findTargetedHero(attack, heroes);
	return pattern.map(({ col, row }) => ({
		col: targetedHero.gridPosition.col + col,
		row: targetedHero.gridPosition.row + row,
	}));
}
