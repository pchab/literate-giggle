import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const fighterCards: Record<Card["id"], Card> = {
	[cardId("short-sword")]: {
		id: cardId("short-sword"),
		name: "Short Sword",
		range: 1,
		image: "/cards/short-sword.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("bull-rush")]: {
		id: cardId("bull-rush"),
		name: "Bull Rush",
		range: 3,
		playRequirement: "requires_empty_cell_or_enemy",
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
	[cardId("shield-block")]: {
		id: cardId("shield-block"),
		name: "Shield Block",
		range: 0,
		image: "/cards/shield-block.png",
		playRequirement: "no_target",
		effects: [
			{
				type: "apply_status",
				status: {
					type: "temp_block",
					amount: 4,
					duration: 1,
				},
				target: "self",
			},
		],
	},
};
