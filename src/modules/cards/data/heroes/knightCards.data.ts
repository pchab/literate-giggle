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

	[cardId("bastard_sword")]: {
		id: cardId("bastard_sword"),
		name: "Bastard Sword",
		range: 1,
		image: "/cards/bastard_sword.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
};
