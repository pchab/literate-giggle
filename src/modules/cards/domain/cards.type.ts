import type {
	GridPosition,
	SurfaceType,
} from "@/modules/battle/domain/grid.type";
import type { Status, StatusType } from "@/modules/figures/domain/status.type";
import {
	isHeroId,
	isMonsterId,
} from "@/modules/figures/helpers/figures.helpers";
import type {
	BattleUnit,
	Hero,
	Monster,
} from "../../figures/domain/figures.type";

export type AnchorTarget = BattleUnit["id"] | GridPosition;

export function anchorIsGridPosition(
	anchorTarget: AnchorTarget,
): anchorTarget is GridPosition {
	return typeof anchorTarget === "object" && "col" in anchorTarget;
}

export function anchorIsHeroId(
	anchorTarget: AnchorTarget,
): anchorTarget is Hero["id"] {
	return !anchorIsGridPosition(anchorTarget) && isHeroId(anchorTarget);
}

export function anchorIsMonsterId(
	anchorTarget: AnchorTarget,
): anchorTarget is Monster["id"] {
	return !anchorIsGridPosition(anchorTarget) && isMonsterId(anchorTarget);
}

export type IntentIcon =
	| "MELEE"
	| "RANGED"
	| "MAGIC"
	| "DEFEND"
	| "DEBUFF"
	| "SUMMON";

export type AITargetPreference =
	| "lowestHp"
	| "random"
	| "lowestDef"
	| "closest"
	| "self";

export type PlayRequirement =
	| "requires_enemy"
	| "requires_ally"
	| "requires_empty_cell"
	| "no_target";

export type EffectTarget =
	| "anchor"
	| "self"
	| "all_enemies"
	| "all_allies"
	| "adjacent_to_anchor";

export type MoveEffect = {
	type: "move";
	target: EffectTarget;
};

export type DamageEffect = {
	type: "damage";
	amount: number;
	target: EffectTarget;
};

export type HealEffect = {
	type: "heal";
	amount: number;
	target: EffectTarget;
};

export type BlockEffect = {
	type: "block";
	amount: number;
	target: EffectTarget;
};

export type PushEffect = {
	type: "push";
	distance: number;
	collisionDamage: number;
	target: EffectTarget;
};

export type SummonEffect = {
	type: "summon";
	blueprintId: string;
	target: EffectTarget;
};

export type ApplyStatusEffect = {
	type: "apply_status";
	status: Status;
	target: EffectTarget;
};

export type CreateSurfaceEffect = {
	type: "create_surface";
	surfaceType: SurfaceType;
	duration: number;
	damage?: number;
	status?: Status;
	spriteBase: string;
	charges?: number;
};

export type CardEffect =
	| MoveEffect
	| DamageEffect
	| HealEffect
	| PushEffect
	| SummonEffect
	| ApplyStatusEffect
	| CreateSurfaceEffect;

export type Card = {
	id: string & { readonly __brand: "CardId" };
	name: string;
	range: number;

	image?: string;
	iconType?: IntentIcon;

	playRequirement: PlayRequirement;
	effects: CardEffect[];

	aiTargetPreference?: AITargetPreference;
	aoePattern?: GridPosition[];
};

export type HeroCard = {
	instanceId: Card["id"];
	baseCardId: Card["id"];
	powerRunes: PowerRunes;
};

export type PowerRunes = {
	// --- CARD-LEVEL MODIFIERS (Applies to the whole card) ---
	bonusRange?: number;
	bonusAoe?: { row: number; col: number }[];

	// --- EFFECT-LEVEL MODIFIERS (Applies to specific effect types) ---
	bonusDamage?: number;
	bonusHeal?: number;

	// --- STATUS-SPECIFIC MODIFIERS ---
	bonusStatusAmount?: Partial<Record<StatusType, number>>;
	bonusStatusDuration?: Partial<Record<StatusType, number>>;
};

export type Hand = [Card, Card | null, Card | null];
