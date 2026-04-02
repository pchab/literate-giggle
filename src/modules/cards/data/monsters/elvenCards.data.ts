import {
	cleavePattern,
	crossPattern,
} from "@/modules/battle/data/attackPattern.data";
import { summonId } from "@/modules/units/helpers/units.helpers";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const elvenCards: Record<Card["id"], Card> = {
	// THE COMMANDER'S TRICK: Summons backup!
	[cardId("elven_horn")]: {
		id: cardId("elven_horn"),
		name: "Call of the Briar",
		range: 1,
		image: "/cards/elven_horn.webp",
		playRequirement: "requires_empty_cell",
		aiTargetPreference: "self",
		effects: [
			{ type: "summon", blueprintId: summonId("briar-wolf"), target: "anchor" },
		],
	},
	[cardId("commander_glaive")]: {
		id: cardId("commander_glaive"),
		name: "Glaive Sweep",
		range: 1,
		image: "/cards/commander_glaive.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestDef",
		aoePattern: cleavePattern,
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},

	// THE WEAVER'S TRICKS: Healing and Ranged Magic
	[cardId("weaver_mend")]: {
		id: cardId("weaver_mend"),
		name: "Nature's Mend",
		range: 2,
		image: "/cards/weaver_mend.webp",
		playRequirement: "requires_ally",
		aiTargetPreference: "lowestHp",
		effects: [
			{ type: "heal", amount: 3, target: "anchor" },
			{
				type: "apply_status",
				status: { type: "regen", amount: 3, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("weaver_whip")]: {
		id: cardId("weaver_whip"),
		name: "Thorn Whip",
		range: 1,
		image: "/cards/weaver_whip.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		effects: [
			{ type: "damage", amount: 5, target: "anchor" },
			{
				type: "apply_status",
				status: { type: "rooted", amount: 0, duration: 2 },
				target: "anchor",
			},
		],
	},

	// --- TREANT CARDS ---
	[cardId("treant_sweep")]: {
		id: cardId("treant_sweep"),
		name: "Branch Sweep",
		range: 1,
		image: "/cards/treant_sweep.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		aoePattern: [
			{ col: 0, row: 0 },
			{ col: -1, row: 0 },
			{ col: 1, row: 0 },
		],
		effects: [{ type: "damage", amount: 8, target: "anchor" }],
	},

	// --- ARCHDRUID CARDS ---
	[cardId("regeneration")]: {
		id: cardId("regeneration"),
		name: "Regeneration",
		range: 0,
		image: "/cards/regeneration.webp",
		playRequirement: "requires_ally",
		aiTargetPreference: "self",
		effects: [
			{ type: "heal", amount: 2, target: "anchor" },
			{
				type: "apply_status",
				status: { type: "regen", amount: 2, duration: 2 },
				target: "all_allies",
			},
		],
	},
	[cardId("overgrowth")]: {
		id: cardId("overgrowth"),
		name: "Overgrowth",
		range: 3,
		image: "/cards/overgrowth.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		aoePattern: crossPattern,
		effects: [
			{
				type: "apply_status",
				status: { type: "rooted", amount: 0, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("poison_spores")]: {
		id: cardId("poison_spores"),
		name: "Poison spores",
		range: 3,
		image: "/cards/poison_spores.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		aoePattern: crossPattern,
		effects: [
			{
				type: "apply_status",
				status: { type: "poison", amount: 3, duration: 2 },
				target: "anchor",
			},
		],
	},
};
