import type { HeroClass } from "@/modules/heroClass/domain/heroClass.types";
import type { Attack } from "../../attacks/attacks";
import type { Card } from "../../cards/domain/cards.type";
import type { GridPosition } from "../../grid/grid.type";

export enum UnitStance {
	IDLE = 0,
	MOVING = 1,
	ATTACKING = 2,
}

export type Figure = {
	spriteBase: string;
	currentHp: number;
	maxHp: number;
	baseDef: number;
	currentBlock: number;
	baseMove: number;
	gridPosition: GridPosition;
};

export type Hero = Figure & {
	id: string & { readonly __brand: "HeroId" };
	heroClass: HeroClass;
	deck: Card[];
	cards: [Card, Card, Card | null];
	passives: string[];
};

export type EnemyType = "BOSS" | "SKELETON" | "BAT" | "ARCHER";
export type Monster = Figure & {
	id: string & { readonly __brand: "MonsterId" };
	enemyType: EnemyType;
	attacks: Attack[];
};

export type Allegiance = "PLAYER" | "ENEMY" | "NEUTRAL";

export type Summon = Figure & {
	id: string & { readonly __brand: "SummonId" };
	name: string;
	allegiance: Allegiance;
};
