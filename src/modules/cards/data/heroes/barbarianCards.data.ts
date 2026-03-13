import { cleavePattern } from "@/modules/battle/data/attackPattern.data";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const barbarianCards: Record<Card["id"], Card> = {
	[cardId("barbarian_placeholder")]: {
		id: cardId("barbarian_placeholder"),
		name: "Barbarian Placeholder",
		range: 1,
		image: "/cards/barbarian.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("great_axe")]: {
		id: cardId("great_axe"),
		name: "Great Axe",
		range: 1,
		image: "/cards/great_axe.webp",
		playRequirement: "requires_enemy",
		aoePattern: cleavePattern,
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
};
