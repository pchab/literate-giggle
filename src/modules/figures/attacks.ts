import type { GridPosition } from "../grid/grid.type";
import type { Hero } from "./figures.type";

type Target = "lowestHp" | "random" | "lowestPhysDef" | "lowestMagDef" | "grid";
export type Attack = {
	id: number;
	target: Target;
	pattern: GridPosition[];
	damage: number;
	effect: "physDmg" | "magDmg";
};

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
	{ col: 0, row: -1 },
	{ col: -1, row: -1 },
	{ col: 1, row: -1 },
	{ col: -2, row: -2 },
	{ col: -1, row: -2 },
	{ col: 0, row: -2 },
	{ col: 1, row: -2 },
	{ col: 2, row: -2 },
];

export const singleTargetPattern: GridPosition[] = [{ col: 0, row: 0 }];

export function filterGridByAttackPattern(
	attack: Attack,
	heroes: Hero[],
): GridPosition[] {
	const { target, pattern } = attack;
	if (target === "grid") {
		return pattern;
	}
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
	const targetedHero = heroes.reduce(reduceFunction);
	return pattern.map(({ col, row }) => ({
		col: targetedHero.gridPosition.col + col,
		row: targetedHero.gridPosition.row + row,
	}));
}
