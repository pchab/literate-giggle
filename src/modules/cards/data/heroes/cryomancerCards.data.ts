import { summonId } from "@/modules/figures/helpers/figures.helpers";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const cryomancerCards: Record<Card["id"], Card> = {
	[cardId("frost_shards")]: {
		id: cardId("frost_shards"),
		name: "Frost Shards",
		range: 2,
		image: "/cards/frost_shards.webp",
		playRequirement: "requires_enemy",
		effects: [
			{
				type: "damage",
				amount: 6,
				target: "anchor",
				projectile: "ARROW",
				vfx: "ICE",
			},
		],
	},

	[cardId("ice_wall")]: {
		id: cardId("ice_wall"),
		name: "Ice Wall",
		range: 1,
		image: "/cards/ice_wall.webp",
		playRequirement: "requires_empty_cell",
		effects: [
			{ type: "summon", blueprintId: summonId("ice_wall"), target: "anchor" },
		],
	},

	[cardId("cryomancer_placeholder")]: {
		id: cardId("cryomancer_placeholder"),
		name: "Cryomancer Placeholder",
		range: 1,
		image: "/cards/cryomancer.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
};
