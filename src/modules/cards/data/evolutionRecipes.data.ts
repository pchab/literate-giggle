import type { Card } from "../domain/cards.type";
import { cardId } from "../helpers/cards.helper";

export type EvolutionRuneId =
	| "rune_rat"
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
		rune_nature: cardId("thorn_club"),
		rune_iron: cardId("iron_club"),
	},
	[cardId("bandage")]: {
		rune_nature: cardId("sylvan_balm"),
		rune_iron: cardId("fortifying_salve"),
	},
	[cardId("summon_arcane_wisp")]: {
		rune_nature: cardId("summon_briar_wolf"),
	},
	[cardId("dagger")]: {
		rune_nature: cardId("thorn_dagger"),
		rune_blood: cardId("vampire_dagger"),
	},
};
