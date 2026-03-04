import type { Attack } from "@/modules/battle/domain/attacks.type";
import type { GridPosition } from "@/modules/battle/domain/grid.type";
import type { Card, Hand } from "@/modules/cards/domain/cards.type";
import type { HeroClass } from "@/modules/figures/domain/heroClass.types";

export enum UnitStance {
	IDLE = 0,
	MOVING = 1,
	ATTACKING = 2,
}

export interface Figure {
	id: string;
	spriteBase: string;
	currentHp: number;
	maxHp: number;
	baseDef: number;
	currentBlock: number;
	baseMove: number;
	gridPosition: GridPosition;
}

export interface Hero extends Figure {
	id: string & { readonly __brand: "HeroId" };
	heroClass: HeroClass;
	deck: Card["id"][];
	hand: Hand;
	passives: string[];
	currentXp: number;
	currentLevel: number;
}

export type EnemyType =
	| "BOSS"
	| "SKELETON"
	| "BAT"
	| "ARCHER"
	| "NECROMANCER"
	| "GOLEM"
	| "GOLEM_OVERSEER"
	| "TREANT"
	| "ELVEN_WEAVER"
	| "BEASTMASTER"
	| "BRIAR_WOLF";

export interface Monster extends Figure {
	id: string & { readonly __brand: "MonsterId" };
	enemyType: EnemyType;
	attacks: Attack[];
	xpReward: number;
}

export type Allegiance = "PLAYER" | "ENEMY" | "NEUTRAL";

export interface Summon extends Figure {
	id: string & { readonly __brand: "SummonId" };
	name: string;
	allegiance: Allegiance;
}
