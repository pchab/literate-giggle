import type { GridPosition } from "@/modules/battle/domain/grid.type";
import type { Card, Hand, HeroCard } from "@/modules/cards/domain/cards.type";
import type { HeroClass } from "@/modules/figures/domain/heroClass.types";
import type { Status, StatusType } from "./status.type";

export enum UnitStance {
	IDLE = 0,
	MOVING = 1,
	ATTACKING = 2,
}

type IntentOption = {
	cardId: Card["id"];
	weight: number;
};

export interface UnitBlueprint extends Omit<Figure, "id"> {
	xpReward: number;
	intentPool: IntentOption[];
}

export interface Figure {
	id: string;
	name: string;
	spriteBase: string;
	maxHp: number;
	baseDef: number;
	baseMove: number;
	immunities?: StatusType[];
	onDeath?: Card["id"];
	size?: number;
}

export interface BattleUnit extends Figure {
	currentHp: number;
	gridPosition: GridPosition;
	statuses: Status[];
	stance: UnitStance;
	isDeathRattle?: boolean;
}

export interface AIBattleUnit extends BattleUnit {
	intentPool: IntentOption[];
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
	heroClass: HeroClass;
	passives: string[];
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
