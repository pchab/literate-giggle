import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const knightCards: Record<Card["id"], Card> = {
	[cardId("knight-placeholder")]: {
		id: cardId("knight-placeholder"),
		name: "Knight Placeholder",
		range: 1,
		image: "/cards/knight.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("knight_weapon")]: {
		id: cardId("knight_weapon"),
		name: "Knight Weapon",
		range: 1,
		image: "/cards/knight.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
};
