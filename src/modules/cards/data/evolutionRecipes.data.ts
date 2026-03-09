import type { Card } from "../domain/cards.type";
import { cardId } from "../helpers/cards.helper";

export type EvolutionRuneId =
	| "rune_iron"
	| "rune_nature"
	| "rune_arcane"
	| "rune_blood";

export const EVOLUTION_RECIPES: Record<
	Card["id"],
	Partial<Record<EvolutionRuneId, Card["id"]>>
> = {
	[cardId("club")]: {
		rune_nature: cardId("thorn_club"),
	},
	[cardId("bandage")]: {
		rune_nature: cardId("sylvan_balm"),
		rune_iron: cardId("fortifying_salve"),
	},
	[cardId("shield_block")]: {
		rune_iron: cardId("heavy_barricade"),
		rune_nature: cardId("briar_wall"),
	},
};
