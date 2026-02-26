import type { Card } from "./cards.type";

function createCardId(id: string): Card["id"] {
	return `card-${id}` as Card["id"];
}

export const cardLibrary: Card[] = [
	{
		id: createCardId("1"),
		name: "Short Sword",
		playRequirement: "requires_enemy",
		range: 2,
		effects: [
			{
				type: "damage",
				amount: 2,
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [createCardId("6"), createCardId("7")],
	},

	{
		id: createCardId("2"),
		name: "Wooden Shield",
		playRequirement: "requires_empty_cell_or_self",
		range: 2,
		effects: [
			{
				type: "move",
				target: "self",
			},
			{
				type: "block",
				amount: 2,
				target: "self",
			},
		],
		xp: 0,
		evolutions: [createCardId("8"), createCardId("9")],
	},

	{
		id: createCardId("3"),
		name: "Arcane Bolt",
		playRequirement: "requires_enemy",
		range: 2,
		effects: [
			{
				type: "damage",
				amount: 2,
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [createCardId("10"), createCardId("11")],
	},

	{
		id: createCardId("4"),
		name: "Arcane Shield",
		playRequirement: "requires_empty_cell_or_self",
		range: 2,
		effects: [
			{
				type: "move",
				target: "self",
			},
			{
				type: "block",
				amount: 2,
				target: "self",
			},
		],
		xp: 0,
		evolutions: [createCardId("12"), createCardId("13")],
	},

	{
		id: createCardId("5"),
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
		evolutions: [createCardId("14"), createCardId("15")],
	},

	// TIER 2 cards
	{
		id: createCardId("6"),
		name: "Long Sword",
		playRequirement: "requires_enemy",
		range: 2,
		effects: [
			{
				type: "damage",
				amount: 3,
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: createCardId("7"),
		name: "Battle Axe",
		playRequirement: "requires_enemy",
		range: 2,
		effects: [
			{
				type: "damage",
				amount: 4,
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: createCardId("8"),
		name: "Steel Shield",
		playRequirement: "requires_empty_cell_or_self",
		range: 2,
		effects: [
			{
				type: "move",
				target: "self",
			},
			{
				type: "block",
				amount: 3,
				target: "self",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: createCardId("9"),
		name: "Heavy Shield",
		playRequirement: "requires_empty_cell_or_self",
		range: 1,
		effects: [
			{
				type: "move",
				target: "self",
			},
			{
				type: "block",
				amount: 4,
				target: "self",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: createCardId("10"),
		name: "Fireball",
		playRequirement: "requires_enemy",
		range: 2,
		effects: [
			{
				type: "damage",
				amount: 4,
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: createCardId("11"),
		name: "Ice Shard",
		playRequirement: "requires_enemy",
		range: 2,
		effects: [
			{
				type: "damage",
				amount: 4,
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: createCardId("12"),
		name: "Fire Shield",
		playRequirement: "requires_empty_cell_or_self",
		range: 2,
		effects: [
			{
				type: "move",
				target: "self",
			},
			{
				type: "block",
				amount: 4,
				target: "self",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: createCardId("13"),
		name: "Ice Wall",
		playRequirement: "requires_empty_cell",
		range: 2,
		effects: [
			{
				type: "summon",
				blueprintId: "ice_wall",
				target: "anchor",
			},
		],
		xp: 0,
		evolutions: [],
	},

	{
		id: createCardId("14"),
		name: "Healing Orb",
		playRequirement: "requires_ally_or_self",
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
		id: createCardId("15"),
		name: "Regen",
		playRequirement: "requires_ally_or_self",
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
