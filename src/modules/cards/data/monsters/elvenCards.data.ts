import { summonId } from "@/modules/figures/helpers/figures.helpers";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const elvenCards: Record<Card["id"], Card> = {
	// THE COMMANDER'S TRICK: Summons backup!
	[cardId("elven_horn")]: {
		id: cardId("elven_horn"),
		name: "Call of the Briar",
		range: 1,
		iconType: "SUMMON",
		playRequirement: "no_target",
		aiTargetPreference: "empty_adjacent",
		effects: [
			{ type: "summon", blueprintId: summonId("briar-wolf"), target: "anchor" },
		],
	},
	[cardId("commander_glaive")]: {
		id: cardId("commander_glaive"),
		name: "Glaive Sweep",
		range: 1,
		iconType: "MELEE",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestDef", // Smart AI: targets your squishy heroes
		aoePattern: [
			{ col: 0, row: 0 },
			{ col: -1, row: 0 },
			{ col: 1, row: 0 },
		],
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},

	// THE WEAVER'S TRICKS: Healing and Ranged Magic
	[cardId("weaver_mend")]: {
		id: cardId("weaver_mend"),
		name: "Nature's Mend",
		range: 2,
		iconType: "MAGIC",
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
	[cardId("weaver_thorn")]: {
		id: cardId("weaver_thorn"),
		name: "Thorn Dart",
		range: 3,
		iconType: "RANGED",
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
		iconType: "MELEE",
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		aoePattern: [
			{ col: 0, row: 0 },
			{ col: -1, row: 0 },
			{ col: 1, row: 0 },
		],
		effects: [{ type: "damage", amount: 8, target: "anchor" }],
	},
};
