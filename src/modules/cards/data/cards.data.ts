import type { Card } from "../domain/cards.type";
import { cardId } from "../helpers/cards.helper";

export const cardLibrary: Record<Card["id"], Card> = {
	[cardId("bandage-1")]: {
		id: cardId("bandage-1"),
		name: "Bandage",
		range: 0,
		playRequirement: "no_target",
		effects: [{ type: "heal", amount: 1, target: "self" }],
	},
	[cardId("bandage-2")]: {
		id: cardId("bandage-2"),
		name: "Bandage",
		range: 0,
		playRequirement: "no_target",
		effects: [{ type: "heal", amount: 2, target: "self" }],
	},
	[cardId("bandage-3")]: {
		id: cardId("bandage-3"),
		name: "Bandage",
		range: 0,
		playRequirement: "no_target",
		effects: [{ type: "heal", amount: 3, target: "self" }],
	},
	[cardId("club-1")]: {
		id: cardId("club-1"),
		name: "Wooden Club",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 2, target: "anchor" }],
	},

	// --- LEVEL 2: Stat Bump ---
	[cardId("club-2")]: {
		id: cardId("club-2"),
		name: "Heavy Club",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 3, target: "anchor" }], // +1 Damage!
	},

	// --- LEVEL 3: The Passive Unlock ---
	[cardId("club-3")]: {
		id: cardId("club-3"),
		name: "Battle-Tested Club",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 3, target: "anchor" }],
	},

	// --- LEVEL 4 (Tier 1): The Promotion! ---
	[cardId("short-sword-1")]: {
		id: cardId("short-sword-1"),
		name: "Short Sword",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("apprentice-staff-1")]: {
		id: cardId("apprentice-staff-1"),
		name: "Apprentice Staff",
		range: 2,
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("arcane-shield-1")]: {
		id: cardId("arcane-shield-1"),
		name: "Arcane Shield",
		range: 2,
		playRequirement: "no_target",
		effects: [{ type: "block", amount: 2, target: "self" }],
	},
	[cardId("arcane-shield-2")]: {
		id: cardId("arcane-shield-2"),
		name: "Arcane Shield",
		range: 2,
		playRequirement: "requires_ally_or_self",
		effects: [{ type: "block", amount: 3, target: "anchor" }],
	},
	[cardId("arcane-shield-3")]: {
		id: cardId("arcane-shield-3"),
		name: "Arcane Shield",
		range: 2,
		playRequirement: "requires_ally_or_self",
		effects: [{ type: "block", amount: 4, target: "anchor" }],
	},
	[cardId("shield-block-1")]: {
		id: cardId("shield-block-1"),
		name: "Shield Block",
		range: 0,
		playRequirement: "no_target",
		effects: [{ type: "block", amount: 4, target: "self" }],
	},
	[cardId("shield-block-2")]: {
		id: cardId("shield-block-2"),
		name: "Shield Block",
		range: 0,
		playRequirement: "no_target",
		effects: [{ type: "block", amount: 5, target: "self" }],
	},
	[cardId("shield-block-3")]: {
		id: cardId("shield-block-3"),
		name: "Shield Block",
		range: 0,
		playRequirement: "no_target",
		effects: [{ type: "block", amount: 6, target: "self" }],
	},
	[cardId("battle-cry-1")]: {
		id: cardId("battle-cry-1"),
		name: "Battle Cry",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [
			{ type: "push", distance: 1, target: "adjacent_to_anchor" }, // Or whatever your AoE target is!
			{ type: "block", amount: 2, target: "self" },
		],
	},
	[cardId("battle-cry-2")]: {
		id: cardId("battle-cry-2"),
		name: "Battle Cry",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [
			{ type: "push", distance: 1, target: "adjacent_to_anchor" }, // Or whatever your AoE target is!
			{ type: "block", amount: 3, target: "self" },
		],
	},
	[cardId("battle-cry-3")]: {
		id: cardId("battle-cry-3"),
		name: "Battle Cry",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [
			{ type: "push", distance: 1, target: "adjacent_to_anchor" }, // Or whatever your AoE target is!
			{ type: "block", amount: 4, target: "self" },
		],
	},
};

export const initialDeck = [cardId("club-1"), cardId("bandage-1")];
