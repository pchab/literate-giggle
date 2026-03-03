import type { GridPosition } from "@/modules/battle/domain/grid.type";
import {
	isHeroId,
	isMonsterId,
} from "@/modules/figures/helpers/figures.helpers";
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
	image: string;
	playRequirement: PlayRequirement;
	effects: CardEffect[];
};

export type Hand = [Card["id"], Card["id"], Card["id"] | null];

export type CardLog = Record<Hero["id"], Record<Card["id"], number>>;
