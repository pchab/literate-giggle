import type { GridPosition } from "@/modules/battle/domain/grid.type";
import type { Card, Hand, HeroCard } from "@/modules/cards/domain/cards.type";
import type { HeroClass } from "@/modules/figures/domain/heroClass.types";
import type { Status } from "./status.type";

export enum UnitStance {
	IDLE = 0,
	MOVING = 1,
	ATTACKING = 2,
}

export interface Figure {
	id: string;
	spriteBase: string;
	maxHp: number;
	baseDef: number;
	baseMove: number;
	// battle stats
	currentHp: number;
	gridPosition: GridPosition;
	statuses: Status[];
}

export interface Hero extends Figure {
	id: string & { readonly __brand: "HeroId" };
	heroClass: HeroClass;
	deck: HeroCard[];
	selectedCards: [HeroCard, HeroCard | null, HeroCard | null];
	passives: string[];
	currentXp: number;
	currentLevel: number;
}

export interface Monster extends Figure {
	id: string & { readonly __brand: "MonsterId" };

	intentPool: {
		cardId: Card["id"];
		weight: number;
	}[];

	xpReward: number;
}

export type Allegiance = "PLAYER" | "ENEMY" | "NEUTRAL";

export interface Summon extends Figure {
	id: string & { readonly __brand: "SummonId" };
	allegiance: Allegiance;

	intentPool: {
		cardId: Card["id"];
		weight: number;
	}[];
}
export type BattleHero = Hero & {
	hand: Hand;
};
