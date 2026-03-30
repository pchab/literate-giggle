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
	[cardId("toxic_dagger")]: {
		id: cardId("toxic_dagger"),
		name: "Toxic Dagger",
		range: 1,
		image: "/cards/dagger.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 4, target: "anchor" },
			{
				type: "apply_status",
				status: { type: "poison", amount: 2, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("acid_dagger")]: {
		id: cardId("acid_dagger"),
		name: "Acid Dagger",
		range: 1,
		image: "/cards/dagger.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 4, target: "anchor" },
			{
				type: "create_surface",
				target: "anchor",
				surfaceType: "ACID",
				status: {
					type: "vulnerable",
					amount: 2,
					duration: 2,
				},
				duration: 2,
				spriteBase: "/surfaces/acid.webp",
			},
		],
	},
	[cardId("thorn_dagger")]: {
		id: cardId("thorn_dagger"),
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
	[cardId("vampire_dagger")]: {
		id: cardId("vampire_dagger"),
		name: "Vampire Dagger",
		range: 1,
		image: "/cards/vampire_dagger.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 4, target: "anchor" },
			{ type: "heal", amount: 1, target: "self" },
		],
	},
	[cardId("poison_shiv")]: {
		id: cardId("poison_shiv"),
		name: "Poison Shiv",
		range: 1,
		image: "/cards/poison_shiv.webp",
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
		image: "/cards/hamstring.webp",
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
