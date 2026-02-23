import type { Card } from "./cards.type";

export const cardLibrary: Card[] = [
	{
		id: 1,
		name: "Short Sword",
		action: {
			type: "physAtt",
			value: 2,
			move: 0,
		},
		xp: 0,
		evolutions: [6, 7],
	},

	{
		id: 2,
		name: "Wooden Shield",
		action: {
			type: "physDef",
			value: 2,
			move: 2,
		},
		xp: 0,
		evolutions: [8, 9],
	},

	{
		id: 3,
		name: "Arcane Bolt",
		action: {
			type: "magAtt",
			value: 2,
			move: 0,
		},
		xp: 0,
		evolutions: [10, 11],
	},

	{
		id: 4,
		name: "Arcane Shield",
		action: {
			type: "magDef",
			value: 2,
			move: 2,
		},
		xp: 0,
		evolutions: [12, 13],
	},

	{
		id: 5,
		name: "Bandage",
		action: {
			type: "heal",
			value: 2,
			move: 0,
		},
		xp: 0,
		evolutions: [14, 15],
	},

	// TIER 2 cards
	{
		id: 6,
		name: "Long Sword",
		action: {
			type: "physAtt",
			value: 3,
			move: 0,
		},
		xp: 0,
		evolutions: [],
	},

	{
		id: 7,
		name: "Battle Axe",
		action: {
			type: "physAtt",
			value: 4,
			move: 0,
		},
		xp: 0,
		evolutions: [],
	},

	{
		id: 8,
		name: "Steel Shield",
		action: {
			type: "physDef",
			value: 3,
			move: 2,
		},
		xp: 0,
		evolutions: [],
	},

	{
		id: 9,
		name: "Heavy Shield",
		action: {
			type: "physDef",
			value: 4,
			move: 1,
		},
		xp: 0,
		evolutions: [],
	},

	{
		id: 10,
		name: "Fireball",
		action: {
			type: "magAtt",
			value: 4,
			move: 0,
		},
		xp: 0,
		evolutions: [],
	},

	{
		id: 11,
		name: "Ice Shard",
		action: {
			type: "magAtt",
			value: 4,
			move: 0,
		},
		xp: 0,
		evolutions: [],
	},

	{
		id: 12,
		name: "Fire Shield",
		action: {
			type: "magDef",
			value: 4,
			move: 0,
		},
		xp: 0,
		evolutions: [],
	},

	{
		id: 13,
		name: "Ice Wall",
		action: {
			type: "magDef",
			value: 2,
			move: 0,
		},
		xp: 0,
		evolutions: [],
	},

	{
		id: 14,
		name: "Healing Orb",
		action: {
			type: "heal",
			value: 4,
			move: 0,
		},
		xp: 0,
		evolutions: [],
	},

	{
		id: 15,
		name: "Regen",
		action: {
			type: "heal",
			value: 2,
			move: 0,
		},
		xp: 0,
		evolutions: [],
	},
];

export const initialDeck = cardLibrary.slice(0, 5);
