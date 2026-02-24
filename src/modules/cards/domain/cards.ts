import type { Card } from "./cards.type";

export const cardLibrary: Card[] = [
	{
		id: 1,
		name: "Short Sword",
		playRequirement: "requires_enemy",
		range: 2,
		effects: [
			{
				type: "damage",
				amount: 2,
				damageType: "physDmg",
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [6, 7],
	},

	{
		id: 2,
		name: "Wooden Shield",
		playRequirement: "requires_empty_cell",
		range: 2,
		effects: [
			{
				type: "move",
				target: "self",
			},
			{
				type: "block",
				amount: 2,
				blockType: "physBlock",
				target: "self",
			},
		],
		xp: 0,
		evolutions: [8, 9],
	},

	{
		id: 3,
		name: "Arcane Bolt",
		playRequirement: "requires_enemy",
		range: 2,
		effects: [
			{
				type: "damage",
				amount: 2,
				damageType: "magDmg",
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [10, 11],
	},

	{
		id: 4,
		name: "Arcane Shield",
		playRequirement: "requires_empty_cell",
		range: 2,
		effects: [
			{
				type: "move",
				target: "self",
			},
			{
				type: "block",
				amount: 2,
				blockType: "magBlock",
				target: "self",
			},
		],
		xp: 0,
		evolutions: [12, 13],
	},

	{
		id: 5,
		name: "Bandage",
		playRequirement: "no_target",
		range: 2,
		effects: [
			{
				type: "heal",
				amount: 2,
				target: "self",
			},
		],
		xp: 0,
		evolutions: [14, 15],
	},

	// TIER 2 cards
	{
		id: 6,
		name: "Long Sword",
		playRequirement: "requires_enemy",
		range: 2,
		effects: [
			{
				type: "damage",
				amount: 3,
				damageType: "physDmg",
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: 7,
		name: "Battle Axe",
		playRequirement: "requires_enemy",
		range: 2,
		effects: [
			{
				type: "damage",
				amount: 4,
				damageType: "physDmg",
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: 8,
		name: "Steel Shield",
		playRequirement: "requires_empty_cell",
		range: 2,
		effects: [
			{
				type: "move",
				target: "self",
			},
			{
				type: "block",
				amount: 3,
				blockType: "physBlock",
				target: "self",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: 9,
		name: "Heavy Shield",
		playRequirement: "requires_empty_cell",
		range: 1,
		effects: [
			{
				type: "move",
				target: "self",
			},
			{
				type: "block",
				amount: 4,
				blockType: "physBlock",
				target: "self",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: 10,
		name: "Fireball",
		playRequirement: "requires_enemy",
		range: 2,
		effects: [
			{
				type: "damage",
				amount: 4,
				damageType: "magDmg",
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: 11,
		name: "Ice Shard",
		playRequirement: "requires_enemy",
		range: 2,
		effects: [
			{
				type: "damage",
				amount: 4,
				damageType: "magDmg",
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: 12,
		name: "Fire Shield",
		playRequirement: "no_target",
		range: 2,
		effects: [
			{
				type: "block",
				amount: 4,
				blockType: "magBlock",
				target: "self",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: 13,
		name: "Ice Wall",
		playRequirement: "requires_empty_cell",
		range: 2,
		effects: [
			{
				type: "block",
				amount: 2,
				blockType: "magBlock",
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: 14,
		name: "Healing Orb",
		playRequirement: "requires_ally",
		range: 2,
		effects: [
			{
				type: "heal",
				amount: 3,
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: 15,
		name: "Regen",
		playRequirement: "requires_ally",
		range: 2,
		effects: [
			{
				type: "heal",
				amount: 2,
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [],
	},
];

export const initialDeck = cardLibrary.slice(0, 5);
