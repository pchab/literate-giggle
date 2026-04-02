import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const archerCards: Record<Card["id"], Card> = {
	[cardId("short_bow")]: {
		id: cardId("short_bow"),
		name: "Short Bow",
		range: 2,
		image: "/cards/short_bow.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 4, target: "anchor", projectile: "ARROW" },
		],
	},
	[cardId("blight_bow")]: {
		id: cardId("blight_bow"),
		name: "Blight Bow",
		range: 2,
		image: "/cards/short_bow.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 4, target: "anchor", projectile: "ARROW" },
			{
				type: "apply_status",
				status: { type: "poison", amount: 1, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("acid_bow")]: {
		id: cardId("acid_bow"),
		name: "Acid Bow",
		range: 2,
		image: "/cards/short_bow.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 4, target: "anchor", projectile: "ARROW" },
			{
				type: "create_surface",
				target: "anchor",
				surfaceType: "HAZARD",
				duration: 2,
				spriteBase: "/surfaces/acid.webp",
				status: {
					type: "vulnerable",
					amount: 2,
					duration: 2,
				},
			},
		],
	},
	[cardId("bear_trap")]: {
		id: cardId("bear_trap"),
		name: "Bear Trap",
		range: 1,
		image: "/cards/bear_trap.webp",
		playRequirement: "requires_empty_cell",
		effects: [
			{
				type: "create_surface",
				target: "anchor",
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
