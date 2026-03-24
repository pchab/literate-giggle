import { crossPattern } from "@/modules/battle/data/attackPattern.data";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const clericCards: Record<Card["id"], Card> = {
	[cardId("iron_mace")]: {
		id: cardId("iron_mace"),
		name: "Iron Mace",
		range: 1,
		image: "/cards/iron_mace.webp",
		playRequirement: "requires_enemy",
		effects: [
			{
				type: "damage",
				amount: 4,
				target: "anchor",
				vfx: "BLUNT",
			},
		],
	},
	[cardId("blight_mace")]: {
		id: cardId("blight_mace"),
		name: "Blight Mace",
		range: 1,
		image: "/cards/iron_mace.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 4, target: "anchor", vfx: "BLUNT" },
			{
				type: "apply_status",
				status: { type: "poison", amount: 1, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("shattering_mace")]: {
		id: cardId("shattering_mace"),
		name: "Shattering Mace",
		range: 1,
		image: "/cards/iron_mace.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 4, target: "anchor", vfx: "BLUNT" },
			{
				type: "apply_status",
				status: { type: "vulnerable", amount: 2, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("divine_aegis")]: {
		id: cardId("divine_aegis"),
		name: "Divine Aegis",
		range: 2,
		image: "/cards/divine_aegis.webp",
		playRequirement: "requires_ally",
		effects: [
			{
				type: "apply_status",
				status: { type: "perma_shield", amount: 4, duration: 999 },
				target: "anchor",
			},
		],
	},
	[cardId("blinding_sigil")]: {
		id: cardId("blinding_sigil"),
		name: "Blinding Sigil",
		range: 3,
		image: "/cards/blinding_sigil.webp",
		playRequirement: "requires_enemy",
		aoePattern: crossPattern,
		effects: [
			{
				type: "apply_status",
				status: { type: "vulnerable", amount: 4, duration: 2 },
				target: "anchor",
			},
		],
	},
};
