import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const hoboCards: Record<Card["id"], Card> = {
	[cardId("club")]: {
		id: cardId("club"),
		name: "Club",
		range: 1,
		image: "/cards/club.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 2, target: "anchor" }],
	},
	[cardId("thorn-club")]: {
		id: cardId("thorn-club"),
		name: "Thorn Club",
		range: 1,
		image: "/cards/club.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 2, target: "anchor" },
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
	[cardId("bandage")]: {
		id: cardId("bandage"),
		name: "Bandage",
		range: 1,
		image: "/cards/bandage.webp",
		playRequirement: "requires_ally",
		effects: [{ type: "heal", amount: 1, target: "anchor" }],
	},
	[cardId("sylvan-balm")]: {
		id: cardId("sylvan-balm"),
		name: "Sylvan Balm",
		range: 1,
		image: "/cards/bandage.webp",
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
	[cardId("fortifying-salve")]: {
		id: cardId("fortifying-salve"),
		name: "Fortifying Salve",
		range: 1,
		image: "/cards/bandage.webp",
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
