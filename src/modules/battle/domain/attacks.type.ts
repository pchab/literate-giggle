import type {
	EnemyType,
	Hero,
	Monster,
} from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "./grid.type";

type Target = "lowestHp" | "random" | "lowestDef" | "grid" | "self";
export type Attack = {
	id: number;
	target: Target;
	pattern: GridPosition[];
	move: number;
	damage: number;
	minRange: number;
	maxRange: number;
	summonType?: EnemyType;
};

export type MonsterIntent = {
	monsterId: Monster["id"];
	targetHeroId: Hero["id"] | null;
	intendedMove: GridPosition;
	dangerZone: GridPosition[];
	attackData: Attack;
};
