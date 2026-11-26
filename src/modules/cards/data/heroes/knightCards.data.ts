import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const knightCards: Record<Card["id"], Card> = {
	[cardId("knight_placeholder")]: {
		id: cardId("knight_placeholder"),
		name: "Knight Placeholder",
		range: 1,
		image: "/cards/knight.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("challenge")]: {
		id: cardId("challenge"),
		name: "Challenge",
		range: 0,
		image: "/cards/shield_wall.webp",
		playRequirement: "no_target",
		effects: [
			{
				type: "apply_status",
				status: { type: "taunt", amount: 1, duration: 1 },
				target: "self",
			},
			{
				type: "apply_status",
				status: { type: "block", amount: 3, duration: 1 },
				target: "self",
			},
		],
	},

	[cardId("bastard_sword")]: {
		id: cardId("bastard_sword"),
		name: "Bastard Sword",
		range: 1,
		image: "/cards/bastard_sword.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
};
