import { createCardId } from "../cards.helper";
import type { Card } from "./cards.type";

export const cardLibrary: Record<Card["id"], Card> = {
	[createCardId("bandage-1")]: {
		id: createCardId("bandage-1"),
		name: "Bandage",
		range: 0,
		playRequirement: "no_target",
		effects: [{ type: "heal", amount: 1, target: "self" }],
		xp: 0,
		maxXp: 3,
		evolutions: [createCardId("bandage-2")],
	},
	[createCardId("bandage-2")]: {
		id: createCardId("bandage-2"),
		name: "Bandage",
		range: 0,
		playRequirement: "no_target",
		effects: [{ type: "heal", amount: 2, target: "self" }],
		xp: 0,
		maxXp: 4,
		evolutions: [createCardId("bandage-3")],
	},
	[createCardId("bandage-3")]: {
		id: createCardId("bandage-3"),
		name: "Bandage",
		range: 0,
		playRequirement: "no_target",
		effects: [{ type: "heal", amount: 3, target: "self" }],
		xp: 0,
		maxXp: 5,
		evolutions: [],
	},
	[createCardId("club-1")]: {
		id: createCardId("club-1"),
		name: "Wooden Club",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 2, target: "anchor" }],
		xp: 0,
		maxXp: 3,
		evolutions: [createCardId("club-2")],
		promotesToClass: "HOBO",
	},

	// --- LEVEL 2: Stat Bump ---
	[createCardId("club-2")]: {
		id: createCardId("club-2"),
		name: "Heavy Club",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 3, target: "anchor" }], // +1 Damage!
		xp: 0,
		maxXp: 4,
		evolutions: [createCardId("club-3")],
	},

	// --- LEVEL 3: The Passive Unlock ---
	[createCardId("club-3")]: {
		id: createCardId("club-3"),
		name: "Battle-Tested Club",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 3, target: "anchor" }],
		xp: 0,
		maxXp: 5,
		evolutions: [
			createCardId("short-sword-1"),
			createCardId("apprentice-staff-1"),
		],
		grantsPassive: "passive-toughened",
	},

	// --- LEVEL 4 (Tier 1): The Promotion! ---
	[createCardId("short-sword-1")]: {
		id: createCardId("short-sword-1"),
		name: "Short Sword",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
		xp: 0,
		maxXp: 5,
		evolutions: [createCardId("short-sword-2")],
		promotesToClass: "FIGHTER",
	},
	[createCardId("apprentice-staff-1")]: {
		id: createCardId("apprentice-staff-1"),
		name: "Apprentice Staff",
		range: 2,
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
		xp: 0,
		maxXp: 5,
		evolutions: [createCardId("apprentice-staff-2")],
		promotesToClass: "MAGE",
	},
	[createCardId("arcane-shield-1")]: {
		id: createCardId("arcane-shield-1"),
		name: "Arcane Shield",
		range: 2,
		playRequirement: "requires_ally_or_self",
		effects: [{ type: "block", amount: 2, target: "anchor" }],
		xp: 0,
		maxXp: 5,
		evolutions: [createCardId("arcane-shield-2")],
	},
	[createCardId("arcane-shield-2")]: {
		id: createCardId("arcane-shield-2"),
		name: "Arcane Shield",
		range: 2,
		playRequirement: "requires_ally_or_self",
		effects: [{ type: "block", amount: 3, target: "anchor" }],
		xp: 0,
		maxXp: 5,
		evolutions: [createCardId("arcane-shield-3")],
	},
	[createCardId("arcane-shield-3")]: {
		id: createCardId("arcane-shield-3"),
		name: "Arcane Shield",
		range: 2,
		playRequirement: "requires_ally_or_self",
		effects: [{ type: "block", amount: 4, target: "anchor" }],
		xp: 0,
		maxXp: 5,
		evolutions: [],
	},
	[createCardId("shield-block-1")]: {
		id: createCardId("shield-block"),
		name: "Shield Block",
		range: 0,
		playRequirement: "no_target",
		effects: [{ type: "block", amount: 4, target: "self" }],
		xp: 0,
		maxXp: 5,
		evolutions: [createCardId("shield-block-2")],
	},
	[createCardId("shield-block-2")]: {
		id: createCardId("shield-block"),
		name: "Shield Block",
		range: 0,
		playRequirement: "no_target",
		effects: [{ type: "block", amount: 5, target: "self" }],
		xp: 0,
		maxXp: 5,
		evolutions: [createCardId("shield-block-3")],
	},
	[createCardId("shield-block-3")]: {
		id: createCardId("shield-block"),
		name: "Shield Block",
		range: 0,
		playRequirement: "no_target",
		effects: [{ type: "block", amount: 6, target: "self" }],
		xp: 0,
		maxXp: 5,
		evolutions: [createCardId("shield-bash")], // Evolves later into an attack/push!
	},
	[createCardId("battle-cry-1")]: {
		id: createCardId("battle-cry"),
		name: "Battle Cry",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [
			{ type: "push", distance: 1, target: "adjacent_to_anchor" }, // Or whatever your AoE target is!
			{ type: "block", amount: 2, target: "self" },
		],
		xp: 0,
		maxXp: 5,
		evolutions: [createCardId("battle-cry-2")],
	},
	[createCardId("battle-cry-2")]: {
		id: createCardId("battle-cry"),
		name: "Battle Cry",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [
			{ type: "push", distance: 1, target: "adjacent_to_anchor" }, // Or whatever your AoE target is!
			{ type: "block", amount: 3, target: "self" },
		],
		xp: 0,
		maxXp: 5,
		evolutions: [createCardId("battle-cry-3")],
	},
	[createCardId("battle-cry-3")]: {
		id: createCardId("battle-cry"),
		name: "Battle Cry",
		range: 1,
		playRequirement: "requires_enemy",
		effects: [
			{ type: "push", distance: 1, target: "adjacent_to_anchor" }, // Or whatever your AoE target is!
			{ type: "block", amount: 4, target: "self" },
		],
		xp: 0,
		maxXp: 5,
		evolutions: [],
	},
};

export const initialDeck = [
	cardLibrary[createCardId("club-1")],
	cardLibrary[createCardId("bandage-1")],
];
