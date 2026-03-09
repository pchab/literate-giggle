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
}

export interface BattleUnit extends Figure {
	currentHp: number;
	gridPosition: GridPosition;
	statuses: Status[];
}

export interface AIBattleUnit extends BattleUnit {
	intentPool: {
		cardId: Card["id"];
		weight: number;
	}[];
}

export interface Hero extends Figure {
	id: string & { readonly __brand: "HeroId" };
	heroClass: HeroClass;
	deck: HeroCard[];
	selectedCards: [HeroCard, HeroCard | null, HeroCard | null];
	passives: string[];
	currentHp: number;
	currentXp: number;
	currentLevel: number;
}

export interface BattleHero extends BattleUnit {
	id: string & { readonly __brand: "HeroId" };
	hand: Hand;
}

export interface Monster extends AIBattleUnit {
	id: string & { readonly __brand: "MonsterId" };
	xpReward: number;
}

export type Allegiance = "PLAYER" | "ENEMY" | "NEUTRAL";

export interface Summon extends AIBattleUnit {
	id: string & { readonly __brand: "SummonId" };
	allegiance: Allegiance;
}
