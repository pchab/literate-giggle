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
		effects: [
			{
				type: "apply_status",
				statusType: "perma_shield",
				amount: 2,
				target: "self",
				duration: 999,
			},
		],
	},
	[cardId("arcane-shield-2")]: {
		id: cardId("arcane-shield-2"),
		...arcaneShieldBase,
		effects: [
			{
				type: "apply_status",
				statusType: "perma_shield",
				amount: 3,
				target: "anchor",
				duration: 999,
			},
		],
	},
	[cardId("arcane-shield-3")]: {
		id: cardId("arcane-shield-3"),
		...arcaneShieldBase,
		effects: [
			{
				type: "apply_status",
				statusType: "perma_shield",
				amount: 4,
				target: "anchor",
				duration: 999,
			},
		],
	},
};
