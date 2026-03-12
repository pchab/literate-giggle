import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const archerCards: Record<Card["id"], Card> = {
	[cardId("short-bow")]: {
		id: cardId("short-bow"),
		name: "Short Bow",
		range: 2,
		image: "/cards/short_bow.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("bear-trap")]: {
		id: cardId("bear-trap"),
		name: "Bear Trap",
		range: 1,
		image: "/cards/bear_trap.webp",
		playRequirement: "requires_empty_cell",
		effects: [
			{
				type: "create_surface",
				surfaceType: "TRAP",
				duration: -1,
				damage: 3,
				status: {
					type: "rooted",
					amount: 0,
					duration: 2,
				},
				spriteBase: "/surfaces/bear_trap.webp",
				charges: 1,
			},
		],
	},
};
