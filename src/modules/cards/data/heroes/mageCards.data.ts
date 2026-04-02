import { summonId } from "@/modules/units/helpers/units.helpers";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const mageCards: Record<Card["id"], Card> = {
	[cardId("arcane_shot")]: {
		id: cardId("arcane_shot"),
		name: "Arcane Shot",
		range: 2,
		image: "/cards/arcane_shot.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 3, target: "anchor", projectile: "ARROW" },
		],
	},
	[cardId("pestilence_bolt")]: {
		id: cardId("pestilence_bolt"),
		name: "Pestilence Bolt",
		range: 2,
		image: "/cards/arcane_shot.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 3, target: "anchor", projectile: "ARROW" },
			{
				type: "apply_status",
				status: { type: "poison", amount: 1, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("volatile_shot")]: {
		id: cardId("volatile_shot"),
		name: "Volatile Shot",
		range: 2,
		image: "/cards/arcane_shot.webp",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "damage", amount: 3, target: "anchor", projectile: "ARROW" },
			{
				type: "apply_status",
				status: { type: "vulnerable", amount: 1, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("arcane_shield")]: {
		id: cardId("arcane_shield"),
		name: "Arcane Shield",
		range: 2,
		image: "/cards/arcane_shield.webp",
		playRequirement: "requires_ally",
		effects: [
			{
				type: "apply_status",
				status: {
					type: "block",
					duration: -1,
					amount: 2,
				},
				target: "anchor",
			},
		],
	},
	[cardId("summon_arcane_wisp")]: {
		id: cardId("summon_arcane_wisp"),
		name: "Summon Arcane Wisp",
		range: 1,
		image: "/cards/arcane_wisp.webp",
		playRequirement: "requires_empty_cell",
		effects: [
			{
				type: "summon",
				blueprintId: summonId("arcane-wisp"),
				target: "anchor",
			},
		],
	},
	[cardId("summon_briar_wolf")]: {
		id: cardId("summon_briar_wolf"),
		name: "Summon Briar Wolf",
		range: 1,
		image: "/cards/briar_wolf.webp",
		playRequirement: "requires_empty_cell",
		aiTargetPreference: "self",
		effects: [
			{ type: "summon", blueprintId: summonId("briar-wolf"), target: "anchor" },
		],
	},
};
