import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const barbarianCards: Record<Card["id"], Card> = {
	[cardId("barbarian-placeholder")]: {
		id: cardId("barbarian-placeholder"),
		name: "Barbarian Placeholder",
		range: 1,
		image: "/cards/barbarian.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("barbarian_weapon")]: {
		id: cardId("barbarian_weapon"),
		name: "Barbarian Weapon",
		range: 1,
		image: "/cards/barbarian.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
};
