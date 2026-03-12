import { summonId } from "@/modules/figures/helpers/figures.helpers";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const mageCards: Record<Card["id"], Card> = {
	[cardId("apprentice-staff")]: {
		id: cardId("apprentice-staff"),
		name: "Apprentice Staff",
		range: 2,
		image: "/cards/apprentice_staff.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 3, target: "anchor" }],
	},
	[cardId("arcane-shield")]: {
		id: cardId("arcane-shield"),
		name: "Arcane Shield",
		range: 2,
		image: "/cards/arcane_shield.webp",
		playRequirement: "requires_ally",
		effects: [
			{
				type: "apply_status",
				status: {
					type: "perma_shield",
					duration: 999,
					amount: 2,
				},
				target: "anchor",
			},
		],
	},
	[cardId("summon-arcane-wisp")]: {
		id: cardId("summon-arcane-wisp"),
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
	[cardId("summon-briar-wolf")]: {
		id: cardId("summon-briar-wolf"),
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
