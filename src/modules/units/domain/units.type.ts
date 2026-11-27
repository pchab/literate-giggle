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
	id: string & { readonly __brand: "BluePrintId" };
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
	/** Boss tip shown in the inspector: how the fight is meant to be won. */
	hint?: string;
	/**
	 * Boss script: moves played in this order, looping, instead of a weighted random
	 * pick from `intentPool`. Overridden by the active phase's pattern.
	 */
	intentPattern?: Card["id"][];
	/** HP-threshold phases, highest threshold first (see BossPhase). */
	phases?: BossPhase[];
	/**
	 * Collisions with this unit deal this many times the collision damage, to both
	 * sides, and ignore DEF and block (e.g. jagged boulders).
	 */
	collisionMultiplier?: number;
}

/**
 * One stage of a boss fight. A boss is in the last phase whose `atHpPercent` its HP
 * has dropped to (so list a 100% phase first). Entering a phase restarts its pattern
 * at the first move and shows the bark above the boss.
 */
export type BossPhase = {
	atHpPercent: number;
	intentPattern: Card["id"][];
	bark?: string;
};

export interface BattleUnit extends Unit {
	/** Position in the current intent pattern (scripted bosses). */
	patternStep?: number;
	/** Index of the current boss phase (scripted bosses). */
	phaseIndex?: number;
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
