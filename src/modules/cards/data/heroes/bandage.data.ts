import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

const bandageBase: Pick<Card, "name" | "range" | "image" | "playRequirement"> =
	{
		name: "Bandage",
		range: 0,
		image: "/cards/bandage.png",
		playRequirement: "no_target",
	};

export const bandageCards: Record<Card["id"], Card> = {
	[cardId("bandage-1")]: {
		id: cardId("bandage-1"),
		...bandageBase,
		effects: [{ type: "heal", amount: 1, target: "self" }],
	},
	[cardId("bandage-2")]: {
		id: cardId("bandage-2"),
		...bandageBase,
		effects: [{ type: "heal", amount: 2, target: "self" }],
	},
	[cardId("bandage-3")]: {
		id: cardId("bandage-3"),
		...bandageBase,
		effects: [{ type: "heal", amount: 3, target: "self" }],
	},
};
