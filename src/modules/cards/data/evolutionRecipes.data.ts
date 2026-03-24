import type { Card } from "../domain/cards.type";
import { cardId } from "../helpers/cards.helper";

export type EvolutionRuneId =
	| "rune_pestilence" // The Rat Cellar Reward
	| "rune_acid" // Barnaby's Lab Reward
	| "rune_arcane"
	| "rune_iron"
	| "rune_nature"
	| "rune_blood"
	| "rune_mountain"
	| "rune_tides";

export const EVOLUTION_RECIPES: Record<
	Card["id"],
	Partial<Record<EvolutionRuneId, Card["id"]>>
> = {
	// --- BASE WEAPONS (Transferable) ---
	[cardId("club")]: {
		// Hobo
		rune_pestilence: cardId("plague_club"),
		rune_acid: cardId("corrosive_club"),
	},
	[cardId("short_sword")]: {
		// Fighter
		rune_pestilence: cardId("venom_sword"),
		rune_acid: cardId("melting_blade"),
	},
	[cardId("dagger")]: {
		// Rogue
		rune_pestilence: cardId("toxic_shiv"),
		rune_acid: cardId("acid_dagger"),
		rune_nature: cardId("thorn_dagger"),
		rune_blood: cardId("vampire_dagger"),
	},
	[cardId("arcane_shot")]: {
		// Mage
		rune_pestilence: cardId("pestilence_bolt"),
		rune_acid: cardId("volatile_shot"),
	},
	[cardId("iron_mace")]: {
		// Cleric
		rune_pestilence: cardId("blight_mace"),
		rune_acid: cardId("shattering_mace"),
	},
	[cardId("short_bow")]: {
		// Archer
		rune_pestilence: cardId("blight_bow"),
		rune_acid: cardId("acid_bow"),
	},

	// --- CORE UTILITIES ---
	[cardId("bandage")]: {
		rune_acid: cardId("cauterizing_salve"),
		rune_nature: cardId("sylvan_balm"),
		rune_iron: cardId("fortifying_salve"),
	},
	[cardId("shove")]: {
		rune_pestilence: cardId("dirty_shove"),
		rune_acid: cardId("flask_shove"),
	},
	[cardId("summon_arcane_wisp")]: {
		rune_nature: cardId("summon_briar_wolf"),
	},
};
