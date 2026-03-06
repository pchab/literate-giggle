import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

const shieldBlockBase: Pick<
	Card,
	"name" | "range" | "image" | "playRequirement"
> = {
	name: "Shield Block",
	range: 0,
	image: "/cards/shield-block.png",
	playRequirement: "no_target",
};

export const shieldBlockCards: Record<Card["id"], Card> = {
	[cardId("shield-block-1")]: {
		id: cardId("shield-block-1"),
		...shieldBlockBase,
		effects: [{ type: "block", amount: 4, target: "self" }],
	},
	[cardId("shield-block-2")]: {
		id: cardId("shield-block-2"),
		...shieldBlockBase,
		effects: [{ type: "block", amount: 5, target: "self" }],
	},
	[cardId("shield-block-3")]: {
		id: cardId("shield-block-3"),
		...shieldBlockBase,
		effects: [{ type: "block", amount: 6, target: "self" }],
	},
};
