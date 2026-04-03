import { adjacentPattern } from "@/modules/battle/data/attackPattern.data";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const goliathToadCards: Record<Card["id"], Card> = {
	[cardId("giant_chomp")]: {
		id: cardId("giant_chomp"),
		name: "Giant Chomp",
		range: 1,
		image: "/cards/giant_chomp.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		effects: [
			{ type: "damage", amount: 8, target: "anchor" },
			{
				type: "apply_status",
				status: { type: "vulnerable", amount: 1, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("tongue_lash")]: {
		id: cardId("tongue_lash"),
		name: "Tongue Lash",
		range: 4,
		image: "/cards/tongue_lash.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		effects: [
			{ type: "damage", amount: 4, target: "anchor" },
			{
				type: "push",
				distance: 2,
				collisionDamage: 0,
				pushDirection: "towards",
				target: "anchor",
			},
			{
				type: "custom_script",
				scriptId: "swallow",
				target: "anchor",
				payload: undefined,
			},
			{
				type: "apply_status",
				status: {
					type: "swallowed",
					amount: 3,
					duration: -1,
				},
				target: "anchor",
			},
			{
				type: "apply_status",
				status: {
					type: "digesting",
					amount: 12,
					duration: -1,
				},
				target: "self",
			},
		],
	},
	[cardId("belly_flop")]: {
		id: cardId("belly_flop"),
		name: "Belly Flop",
		range: 1,
		image: "/cards/belly_flop.webp",
		playRequirement: "no_target",
		aiTargetPreference: "closest",
		aoePattern: adjacentPattern,
		effects: [
			{ type: "damage", amount: 4, target: "anchor" },
			{
				type: "push",
				distance: 1,
				collisionDamage: 2,
				target: "anchor",
				pushDirection: "away",
			},
		],
	},
	[cardId("panic_run")]: {
		id: cardId("panic_run"),
		name: "Panic Run",
		image: "/cards/panic_run.webp",
		range: 0,
		playRequirement: "requires_empty_cell",
		aiTargetPreference: { col: 11, row: 4 },
		effects: [], // No combat effects needed! The AI will just walk and end turn.
	},
	[cardId("cower")]: {
		id: cardId("cower"),
		name: "Cower",
		image: "/cards/cower.webp",
		range: 0,
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [
			{
				type: "apply_status",
				status: { type: "block", amount: 1, duration: 1 },
				target: "self",
			},
		],
	},
};
