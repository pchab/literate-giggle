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

	[cardId("war_cry")]: {
		id: cardId("war_cry"),
		name: "War Cry",
		range: 0,
		image: "/cards/unholy_strength.webp",
		playRequirement: "no_target",
		effects: [
			{
				type: "apply_status",
				status: { type: "might", amount: 2, duration: 2 },
				target: "self",
			},
			{
				type: "apply_status",
				status: { type: "weak", amount: 1, duration: 2 },
				target: "all_enemies",
			},
		],
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
