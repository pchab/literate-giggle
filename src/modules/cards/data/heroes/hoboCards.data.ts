import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const hoboCards: Record<Card["id"], Card> = {
	[cardId("club")]: {
		id: cardId("club"),
		name: "Club",
		range: 1,
		image: "/cards/club.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 2, target: "anchor", vfx: "BLUNT" }],
	},
	[cardId("plague_club")]: {
		id: cardId("plague_club"),
		name: "Plague Club",
		range: 1,
		image: "/cards/club.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 2, target: "anchor", vfx: "BLUNT" },
			{
				type: "apply_status",
				status: { type: "poison", amount: 1, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("corrosive_club")]: {
		id: cardId("corrosive_club"),
		name: "Corrosive Club",
		range: 1,
		image: "/cards/club.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 2, target: "anchor", vfx: "BLUNT" },
			{
				type: "apply_status",
				status: { type: "vulnerable", amount: 1, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("iron_club")]: {
		id: cardId("i_ronclub"),
		name: "Club",
		range: 1,
		image: "/cards/iron_club.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 2, target: "anchor", vfx: "BLUNT" },
			{ type: "push", distance: 1, collisionDamage: 2, target: "anchor" },
		],
	},
	[cardId("thorn-club")]: {
		id: cardId("thorn-club"),
		name: "Thorn Club",
		range: 1,
		image: "/cards/thorn_club.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 2, target: "anchor", vfx: "BLUNT" },
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
	[cardId("shove")]: {
		id: cardId("shove"),
		name: "Shove",
		range: 1,
		image: "/cards/shove.webp",
		playRequirement: "requires_entity",
		effects: [
			{ type: "push", distance: 1, collisionDamage: 1, target: "anchor" },
		],
	},
	[cardId("dirty_shove")]: {
		id: cardId("dirty_shove"),
		name: "Dirty Shove",
		range: 1,
		image: "/cards/shove.webp",
		playRequirement: "requires_entity",
		effects: [
			{ type: "push", distance: 1, collisionDamage: 1, target: "anchor" },
			{
				type: "apply_status",
				status: { type: "poison", amount: 1, duration: 2 },
				target: "anchor",
			},
		],
	},

	// Acid + Shove = Throwing an acid flask instead of pushing. Range increases!
	[cardId("flask_shove")]: {
		id: cardId("flask_shove"),
		name: "Acid Flask",
		range: 2,
		image: "/cards/shove.webp",
		playRequirement: "requires_empty_cell",
		effects: [
			{
				type: "create_surface",
				surfaceType: "ACID",
				duration: 3,
				spriteBase: "/surfaces/acid.webp",
			},
		],
	},

	// Acid + Bandage = Massive heal, but strips your armor.
	[cardId("cauterizing_salve")]: {
		id: cardId("cauterizing_salve"),
		name: "Cauterizing Salve",
		range: 1,
		image: "/cards/bandage.webp",
		playRequirement: "requires_ally",
		effects: [
			{ type: "heal", amount: 4, target: "anchor" }, // Huge heal compared to base Bandage
			{
				type: "apply_status",
				status: { type: "vulnerable", amount: 2, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("bandage")]: {
		id: cardId("bandage"),
		name: "Bandage",
		range: 1,
		image: "/cards/bandage.webp",
		playRequirement: "requires_ally",
		effects: [{ type: "heal", amount: 1, target: "anchor" }],
	},
	[cardId("sylvan_balm")]: {
		id: cardId("sylvan_balm"),
		name: "Sylvan Balm",
		range: 1,
		image: "/cards/sylvan_balm.webp",
		playRequirement: "requires_ally",
		effects: [
			{ type: "heal", amount: 1, target: "anchor" },
			{
				type: "apply_status",
				status: {
					type: "regen",
					amount: 1,
					duration: 1,
				},
				target: "anchor",
			},
		],
	},
	[cardId("fortifying_salve")]: {
		id: cardId("fortifying_salve"),
		name: "Fortifying Salve",
		range: 1,
		image: "/cards/fortifying_salve.webp",
		playRequirement: "requires_ally",
		effects: [
			{ type: "heal", amount: 1, target: "anchor" },
			{
				type: "apply_status",
				status: {
					type: "temp_block",
					amount: 1,
					duration: 1,
				},
				target: "anchor",
			},
		],
	},
};
