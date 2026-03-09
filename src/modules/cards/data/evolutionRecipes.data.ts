import type { Card } from "../domain/cards.type";
import { cardId } from "../helpers/cards.helper";

export type EvolutionRuneId =
	| "rune_iron"
	| "rune_nature"
	| "rune_arcane"
	| "rune_blood"
	| "rune_mountain";

export const EVOLUTION_RECIPES: Record<
	Card["id"],
	Partial<Record<EvolutionRuneId, Card["id"]>>
> = {
	[cardId("club")]: {
		rune_nature: cardId("thorn-club"),
	},
	[cardId("bandage")]: {
		rune_nature: cardId("sylvan-balm"),
		rune_iron: cardId("fortifying-salve"),
	},
	[cardId("summon-arcane-wisp")]: {
		rune_nature: cardId("summon-briar-wolf"),
	},
};
