import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

const shortSwordBase: Pick<
	Card,
	"name" | "range" | "image" | "playRequirement"
> = {
	name: "Short Sword",
	range: 1,
	image: "/cards/short-sword.png",
	playRequirement: "requires_enemy",
};

export const shortSwordCards: Record<Card["id"], Card> = {
	[cardId("short-sword-1")]: {
		id: cardId("short-sword-1"),
		...shortSwordBase,
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("short-sword-2")]: {
		id: cardId("short-sword-2"),
		...shortSwordBase,
		effects: [{ type: "damage", amount: 5, target: "anchor" }],
	},
	[cardId("short-sword-3")]: {
		id: cardId("short-sword-3"),
		...shortSwordBase,
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
};
