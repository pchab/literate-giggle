import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";
import { elvenCards } from "./elvenCards.data";

export const monsterCardLibrary: Record<Card["id"], Card> = {
	// BASIC MONSTER CARDS (Shared)
	[cardId("monster_melee_attack")]: {
		id: cardId("monster_melee_attack"),
		name: "Basic Attack",
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
		effects: [{
			type: "apply_status",
			statusType: "temp_block",
			amount: 5,
			target: "self",
			duration: 1,
		},],
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
		range: 0,
		iconType: "SUMMON",
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [{ type: "summon", blueprintId: "SKELETON", target: "self" }],
	},

	...elvenCards,
};
