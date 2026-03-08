import type { GridPosition } from "@/modules/battle/domain/grid.type";
import type { StatusType } from "@/modules/figures/domain/status.type";
import {
	isHeroId,
	isMonsterId,
} from "@/modules/figures/helpers/figures.helpers";
import type { Figure, Hero, Monster } from "../../figures/domain/figures.type";

export type AnchorTarget = Figure["id"] | GridPosition;

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
	| "requires_ally_or_self"
	| "requires_empty_cell"
	| "requires_empty_cell_or_self"
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
	statusType: StatusType;
	amount: number;
	duration: number;
	target: EffectTarget;
};

export type CardEffect =
	| MoveEffect
	| DamageEffect
	| HealEffect
	| PushEffect
	| SummonEffect
	| ApplyStatusEffect;

export type Card = {
	id: string & { readonly __brand: "CardId" };
	name: string;
	range: number;

	// Visuals
	image?: string;
	iconType?: IntentIcon;

	// Rules
	playRequirement: PlayRequirement;
	effects: CardEffect[];

	// --- AI & Spatial Data (Ported from Attack) ---
	aiTargetPreference?: AITargetPreference;
	aoePattern?: GridPosition[];
};

export type Hand = [Card["id"], Card["id"], Card["id"] | null];
