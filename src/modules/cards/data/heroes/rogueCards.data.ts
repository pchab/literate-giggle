import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const rogueCards: Record<Card["id"], Card> = {
	[cardId("dagger")]: {
		id: cardId("dagger"),
		name: "Dagger",
		range: 1,
		image: "/cards/dagger.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("thorn-dagger")]: {
		id: cardId("thorn-dagger"),
		name: "Thorn Dagger",
		range: 1,
		image: "/cards/thorn_dagger.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 4, target: "anchor" },
			{
				type: "apply_status",
				status: {
					type: "vulnerable",
					amount: 2,
					duration: 2,
				},
				target: "anchor",
			},
		],
	},
	[cardId("vampire-dagger")]: {
		id: cardId("vampire-dagger"),
		name: "Vampire Dagger",
		range: 1,
		image: "/cards/vampire_dagger.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 4, target: "anchor" },
			{ type: "heal", amount: 1, target: "self" },
		],
	},
	[cardId("toxic-shiv")]: {
		id: cardId("toxic-shiv"),
		name: "Toxic Shiv",
		range: 1,
		image: "/cards/toxic_shiv.webp",
		playRequirement: "requires_enemy",
		effects: [
			{
				type: "apply_status",
				status: {
					type: "poison",
					amount: 2,
					duration: 2,
				},
				target: "anchor",
			},
		],
	},
	[cardId("hamstring")]: {
		id: cardId("hamstring"),
		name: "Hamstring",
		range: 1,
		iconType: "DEBUFF",
		playRequirement: "requires_enemy",
		effects: [
			{
				type: "apply_status",
				status: {
					type: "rooted",
					amount: 1,
					duration: 2,
				},
				target: "anchor",
			},
		],
	},
};
