import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const hoboCards: Record<Card["id"], Card> = {
	[cardId("club")]: {
		id: cardId("club"),
		name: "Club",
		range: 1,
		image: "/cards/club.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 2, target: "anchor", vfx: "BLUNT" },
		],
	},
	[cardId("iron_club")]: {
		id: cardId("i_ronclub"),
		name: "Club",
		range: 1,
		image: "/cards/iron_club.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 2, target: "anchor", vfx: "BLUNT" },
			{ type: "push", distance: 1, collisionDamage: 2, target: "anchor" },
		],
	},
	[cardId("thorn-club")]: {
		id: cardId("thorn-club"),
		name: "Thorn Club",
		range: 1,
		image: "/cards/thorn_club.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 2, target: "anchor", vfx: "BLUNT" },
			{
				type: "apply_status",
				status: {
					type: "vulnerable",
					amount: 2,
					duration: 2,
				},
				target: "anchor",
			},
		],
	},
	[cardId("shove")]: {
		id: cardId("shove"),
		name: "Shove",
		range: 1,
		image: "/cards/shove.webp",
		playRequirement: "requires_entity",
		effects: [
			{ type: "push", distance: 1, collisionDamage: 1, target: "anchor" },
		],
	},
	[cardId("bandage")]: {
		id: cardId("bandage"),
		name: "Bandage",
		range: 1,
		image: "/cards/bandage.webp",
		playRequirement: "requires_ally",
		effects: [{ type: "heal", amount: 1, target: "anchor" }],
	},
	[cardId("sylvan_balm")]: {
		id: cardId("sylvan_balm"),
		name: "Sylvan Balm",
		range: 1,
		image: "/cards/sylvan_balm.webp",
		playRequirement: "requires_ally",
		effects: [
			{ type: "heal", amount: 1, target: "anchor" },
			{
				type: "apply_status",
				status: {
					type: "regen",
					amount: 1,
					duration: 1,
				},
				target: "anchor",
			},
		],
	},
	[cardId("fortifying_salve")]: {
		id: cardId("fortifying_salve"),
		name: "Fortifying Salve",
		range: 1,
		image: "/cards/fortifying_salve.webp",
		playRequirement: "requires_ally",
		effects: [
			{ type: "heal", amount: 1, target: "anchor" },
			{
				type: "apply_status",
				status: {
					type: "temp_block",
					amount: 1,
					duration: 1,
				},
				target: "anchor",
			},
		],
	},
};
