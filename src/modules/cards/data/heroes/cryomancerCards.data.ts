import { summonId } from "@/modules/figures/helpers/figures.helpers";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const cryomancerCards: Record<Card["id"], Card> = {
	[cardId("cryomancer_weapon")]: {
		id: cardId("cryomancer_weapon"),
		name: "Cryomancer Weapon",
		range: 2,
		image: "/cards/cryomancer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},

	[cardId("ice-wall")]: {
		id: cardId("ice-wall"),
		name: "Ice Wall",
		range: 1,
		image: "/cards/ice-wall.png",
		playRequirement: "requires_empty_cell",
		effects: [
			{ type: "summon", blueprintId: summonId("ice-wall"), target: "anchor" },
		],
	},

	[cardId("cryomancer-placeholder")]: {
		id: cardId("cryomancer-placeholder"),
		name: "Cryomancer Placeholder",
		range: 1,
		image: "/cards/cryomancer.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
};
