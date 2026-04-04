import type {
	BoundingBox,
	GridPosition,
	SurfaceType,
} from "@/modules/battle/domain/grid.type";
import type { VfxType } from "@/modules/battle/domain/vfx.type";
import type { Status, StatusType } from "@/modules/units/domain/status.type";
import type { Summon } from "@/modules/units/domain/units.type";

export type AnchorTarget = BoundingBox | null;

export type AITargetPreference =
	| "lowestHp"
	| "random"
	| "lowestDef"
	| "closest"
	| "self"
	| "away"
	| GridPosition;

export const PLAY_REQUIREMENTS: PlayRequirement[] = [
	"requires_enemy",
	"requires_ally",
	"requires_entity",
	"requires_empty_cell",
	"no_target",
];
export type PlayRequirement =
	| "requires_enemy"
	| "requires_ally"
	| "requires_entity"
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
	projectile?: VfxType;
	vfx?: VfxType;
};

export type HealEffect = {
	type: "heal";
	amount: number;
	target: EffectTarget;
	projectile?: VfxType;
};

export type PushEffect = {
	type: "push";
	distance: number;
	collisionDamage: number;
	target: EffectTarget;
	pushDirection?: "away" | "sideways" | "towards";
};

export type ChargeEffect = {
	type: "charge";
	distance: number;
	collisionDamage: number;
	target: "anchor";
};

export type SummonEffect = {
	type: "summon";
	blueprintId: Summon["id"];
	target: EffectTarget;
};

export type ApplyStatusEffect = {
	type: "apply_status";
	target: EffectTarget;
	status: Status;
	projectile?: VfxType;
};

export type CreateSurfaceEffect = {
	type: "create_surface";
	target: EffectTarget;
	size?: BoundingBox["size"];
	surfaceType: SurfaceType;
	duration: number;
	damage?: number;
	status?: Status;
	spriteBase: string;
	charges?: number;
};

export type CustomScriptEffect<P> = {
	type: "custom_script";
	scriptId: string;
	target: EffectTarget;
	payload: P;
};

export type CardEffect =
	| MoveEffect
	| DamageEffect
	| HealEffect
	| PushEffect
	| ChargeEffect
	| SummonEffect
	| ApplyStatusEffect
	| CreateSurfaceEffect
	| CustomScriptEffect<unknown>;

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
	bonusPushDistance?: number;
	bonusPushCollision?: number;

	// --- STATUS-SPECIFIC MODIFIERS ---
	bonusStatusAmount?: Partial<Record<StatusType, number>>;
	bonusStatusDuration?: Partial<Record<StatusType, number>>;
};

export type Hand = [Card, Card | null, Card | null];
