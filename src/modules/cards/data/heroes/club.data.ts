import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

const clubBase: Pick<Card, "name" | "range" | "image" | "playRequirement"> = {
	name: "Club",
	range: 1,
	image: "/cards/club.png",
	playRequirement: "requires_enemy",
};

export const clubCards: Record<Card["id"], Card> = {
	[cardId("club-1")]: {
		id: cardId("club-1"),
		...clubBase,
		effects: [{ type: "damage", amount: 2, target: "anchor" }],
	},
	[cardId("club-2")]: {
		id: cardId("club-2"),
		...clubBase,
		effects: [{ type: "damage", amount: 3, target: "anchor" }],
	},
	[cardId("club-3")]: {
		id: cardId("club-3"),
		...clubBase,
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
};
