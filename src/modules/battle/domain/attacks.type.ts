import type { Hero, Monster } from "../../figures/domain/figures.type";
import type { GridPosition } from "./grid.type";

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

export type MonsterIntent = {
	monsterId: Monster["id"];
	targetHeroId: Hero["id"] | null;
	intendedMove: GridPosition;
	dangerZone: GridPosition[];
	attackData: Attack;
};
