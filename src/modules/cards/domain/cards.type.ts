import type {
	GridPosition,
	SurfaceType,
} from "@/modules/battle/domain/grid.type";
import type { Summon } from "@/modules/figures/domain/figures.type";
import type { Status, StatusType } from "@/modules/figures/domain/status.type";

export type AnchorTarget = GridPosition | null;

export type AITargetPreference =
	| "lowestHp"
	| "random"
	| "lowestDef"
	| "closest"
	| "self"
	| "empty_adjacent";

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
	| "adjacent_to_anchor"
	| "path";

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
	pushDirection?: "away" | "sideways" | "towards";
};

export type SummonEffect = {
	type: "summon";
	blueprintId: Summon["id"];
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

	image: string;

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
