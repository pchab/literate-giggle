import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

const battleCryBase: Pick<
	Card,
	"name" | "range" | "image" | "playRequirement"
> = {
	name: "Battle Cry",
	range: 1,
	image: "/cards/battle-cry.png",
	playRequirement: "requires_enemy",
};

export const battleCryCards: Record<Card["id"], Card> = {
	[cardId("battle-cry-1")]: {
		id: cardId("battle-cry-1"),
		...battleCryBase,
		effects: [
			{ type: "push", distance: 2, collisionDamage: 3, target: "anchor" },
		],
	},
	[cardId("battle-cry-2")]: {
		id: cardId("battle-cry-2"),
		...battleCryBase,
		effects: [
			{ type: "push", distance: 2, collisionDamage: 4, target: "anchor" },
		],
	},
	[cardId("battle-cry-3")]: {
		id: cardId("battle-cry-3"),
		...battleCryBase,
		effects: [
			{ type: "push", distance: 3, collisionDamage: 5, target: "anchor" },
		],
	},
};
