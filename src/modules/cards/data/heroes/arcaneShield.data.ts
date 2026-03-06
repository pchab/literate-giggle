import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

const arcaneShieldBase: Pick<
	Card,
	"name" | "range" | "image" | "playRequirement"
> = {
	name: "Arcane Shield",
	range: 2,
	image: "/cards/arcane-shield.png",
	playRequirement: "requires_ally_or_self",
};

export const arcaneShieldCards: Record<Card["id"], Card> = {
	[cardId("arcane-shield-1")]: {
		id: cardId("arcane-shield-1"),
		...arcaneShieldBase,
		playRequirement: "no_target",
		effects: [{ type: "block", amount: 2, target: "self" }],
	},
	[cardId("arcane-shield-2")]: {
		id: cardId("arcane-shield-2"),
		...arcaneShieldBase,
		effects: [{ type: "block", amount: 3, target: "anchor" }],
	},
	[cardId("arcane-shield-3")]: {
		id: cardId("arcane-shield-3"),
		...arcaneShieldBase,
		effects: [{ type: "block", amount: 4, target: "anchor" }],
	},
};
