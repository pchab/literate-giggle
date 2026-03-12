import { summonId } from "@/modules/figures/helpers/figures.helpers";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";
import { elvenCards } from "./elvenCards.data";

export const monsterCardLibrary: Record<Card["id"], Card> = {
	// BASIC MONSTER CARDS (Shared)
	[cardId("monster_melee_attack")]: {
		id: cardId("monster_melee_attack"),
		name: "Basic Attack",
		image: "/cards/club.webp",
		range: 1,
		iconType: "MELEE",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		effects: [{ type: "damage", amount: 3, target: "anchor" }],
	},
	[cardId("monster_ranged_attack")]: {
		id: cardId("monster_ranged_attack"),
		name: "Basic Ranged Attack",
		range: 2,
		iconType: "RANGED",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		effects: [{ type: "damage", amount: 2, target: "anchor" }],
	},
	// --- RAT CARD ---
	[cardId("rat-bite")]: {
		id: cardId("rat-bite"),
		name: "Rat Bite",
		range: 1,
		iconType: "MELEE",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		effects: [{ type: "damage", amount: 2, target: "anchor" }],
	},
	[cardId("nasty-bite")]: {
		id: cardId("nasty-bite"),
		name: "Nasty Bite",
		range: 1,
		iconType: "MELEE",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		effects: [
			{ type: "damage", amount: 2, target: "anchor" },
			{
				type: "apply_status",
				status: { type: "poison", amount: 1, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("call_more_rats")]: {
		id: cardId("call_more_rats"),
		name: "Call more rats",
		range: 1,
		iconType: "SUMMON",
		playRequirement: "no_target",
		aiTargetPreference: "empty_adjacent",
		effects: [
			{ type: "summon", blueprintId: summonId("rat"), target: "anchor" },
		],
	},

	// --- SKELETON CARDS ---
	[cardId("skel_slash")]: {
		id: cardId("skel_slash"),
		name: "Rusty Blade",
		range: 1,
		iconType: "MELEE",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("skel_guard")]: {
		id: cardId("skel_guard"),
		name: "Bone Shield",
		range: 0,
		iconType: "DEFEND",
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [
			{
				type: "apply_status",
				status: {
					type: "temp_block",
					amount: 5,
					duration: 1,
				},
				target: "self",
			},
		],
	},

	// --- NECROMANCER CARDS ---
	[cardId("necromancer_bolt")]: {
		id: cardId("necromancer_bolt"),
		name: "Dark Bolt",
		range: 2,
		iconType: "RANGED",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
	[cardId("necromancer_summon")]: {
		id: cardId("necromancer_summon"),
		name: "Summon Minion",
		range: 1,
		iconType: "SUMMON",
		playRequirement: "no_target",
		aiTargetPreference: "empty_adjacent",
		effects: [
			{ type: "summon", blueprintId: summonId("skeleton"), target: "anchor" },
		],
	},

	// --- SUMMON CARDS ---
	[cardId("wisp_zap")]: {
		id: cardId("wisp_zap"),
		name: "Wisp Zap",
		range: 2,
		iconType: "RANGED",
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		effects: [{ type: "damage", amount: 2, target: "anchor" }],
	},
	[cardId("briar_bite")]: {
		id: cardId("briar_bite"),
		name: "Briar Bite",
		range: 1,
		iconType: "MELEE",
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		effects: [
			{ type: "damage", amount: 3, target: "anchor" },
			{
				type: "apply_status",
				status: {
					type: "poison",
					amount: 2,
					duration: 2,
				},
			},
		],
	},

	...elvenCards,
};
