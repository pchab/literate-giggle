import type {
	BoundingBox,
	SurfaceType,
} from "@/modules/battle/domain/grid.type";
import type { Card, Hand, HeroCard } from "@/modules/cards/domain/cards.type";
import type { HeroClass } from "@/modules/units/domain/heroClass.types";
import type { Status, StatusType } from "./status.type";

export enum UnitStance {
	IDLE = 0,
	MOVING = 1,
	ATTACKING = 2,
}

export type UnitSpriteVariant =
	| "default"
	| "variant_ruby"
	| "variant_emerald"
	| "variant_sapphire"
	| "variant_amethyst"
	| "variant_sunset"
	| "elite_gold"
	| "shadow"
	| "undead_pale"
	| "undead_toxic"
	| "ethereal";

type IntentOption = {
	cardId: Card["id"];
	weight: number;
};

export interface UnitBlueprint extends Omit<Unit, "id" | "variant"> {
	availableVariants?: UnitSpriteVariant[];
	xpReward: number;
	intentPool: IntentOption[];
}

export interface Unit {
	id: string;
	name: string;
	spriteBase: string;
	variant: UnitSpriteVariant;
	maxHp: number;
	baseDef: number;
	baseMove: number;
	immunities?: StatusType[];
	surfaceImmunities?: SurfaceType[];
	onDeath?: Card["id"];
	size?: BoundingBox["size"];
}

export interface BattleUnit extends Unit {
	currentHp: number;
	gridPosition: BoundingBox["gridPosition"];
	statuses: Status[];
	stance: UnitStance;
	isDeathRattle?: boolean;
}

export interface AIBattleUnit extends BattleUnit {
	intentPool: IntentOption[];
}

export interface Hero extends Unit {
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
