import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const fighterCards: Record<Card["id"], Card> = {
	[cardId("short_sword")]: {
		id: cardId("short_sword"),
		name: "Short Sword",
		range: 1,
		image: "/cards/short_sword.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("venom_sword")]: {
		id: cardId("venom_sword"),
		name: "Venom Sword",
		range: 1,
		image: "/cards/short_sword.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 4, target: "anchor" },
			{
				type: "apply_status",
				status: { type: "poison", amount: 1, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("melting_blade")]: {
		id: cardId("melting_blade"),
		name: "Melting Blade",
		range: 1,
		image: "/cards/short_sword.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 4, target: "anchor" },
			{
				type: "apply_status",
				status: { type: "vulnerable", amount: 2, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("bull_rush")]: {
		id: cardId("bull_rush"),
		name: "Bull Rush",
		image: "/cards/bull_rush.webp",
		range: 3,
		playRequirement: "requires_enemy",
		effects: [
			{
				type: "damage",
				amount: 2,
				target: "path",
			},
			{
				type: "push",
				distance: 1,
				collisionDamage: 2,
				target: "path",
				pushDirection: "sideways",
			},
			{
				type: "move",
				target: "self",
			},
		],
	},
	[cardId("shield_block")]: {
		id: cardId("shield_block"),
		name: "Shield Block",
		range: 0,
		image: "/cards/shield_block.webp",
		playRequirement: "no_target",
		effects: [
			{
				type: "apply_status",
				status: {
					type: "block",
					amount: 4,
					duration: 1,
				},
				target: "self",
			},
		],
	},
};
