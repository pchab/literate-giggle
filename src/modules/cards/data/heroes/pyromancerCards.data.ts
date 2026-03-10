import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const pyromancerCards: Record<Card["id"], Card> = {
	[cardId("pyromancer-placeholder")]: {
		id: cardId("pyromancer-placeholder"),
		name: "Pyromancer Placeholder",
		range: 1,
		image: "/cards/pyromancer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},

	[cardId("pyromancer_weapon")]: {
		id: cardId("pyromancer_weapon"),
		name: "Pyromancer Weapon",
		range: 2,
		image: "/cards/pyromancer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
};
