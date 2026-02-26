import { isHeroId, isMonsterId } from "@/modules/figures/figures.helpers";
import type { GridPosition } from "@/modules/grid/grid.type";
import type { HeroClass } from "@/modules/heroClass/domain/heroClass.types";
import type { Hero, Monster, Summon } from "../../figures/domain/figures.type";

export type AnchorTarget =
	| Hero["id"]
	| Monster["id"]
	| Summon["id"]
	| GridPosition;

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

export type CardEffect =
	| {
			type: "move";
			target: EffectTarget;
	  }
	| {
			type: "damage";
			amount: number;
			target: EffectTarget;
	  }
	| { type: "heal"; amount: number; target: EffectTarget }
	| {
			type: "block";
			amount: number;
			target: EffectTarget;
	  }
	| { type: "push"; distance: number; target: EffectTarget }
	| {
			type: "summon";
			blueprintId: string; // e.g., "ice_wall", "healing_totem"
			target: EffectTarget;
	  };

export type Card = {
	id: string & { readonly __brand: "CardId" };
	name: string;
	range: number;
	playRequirement: PlayRequirement;
	effects: CardEffect[];

	// XP & Leveling
	xp: number; // Current XP
	maxXp: number; // XP required to hit the next milestone
	evolutions: Card["id"][]; // The Card IDs it can turn into

	// --- THE PROGRESSION TRIGGERS ---
	// If evolving INTO this card changes your class (e.g., Short Sword makes you a Fighter)
	promotesToClass?: HeroClass;

	// If reaching this level unlocks a permanent passive (e.g., "Toughened", "Fleet Footed")
	grantsPassive?: string;
};

export type CardLog = Record<Hero["id"], Record<Card["id"], number>>;
