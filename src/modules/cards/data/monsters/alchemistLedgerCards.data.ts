import { summonId } from "@/modules/figures/helpers/figures.helpers";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const alchemistLedgerCards: Record<Card["id"], Card> = {
	[cardId("volatile_transmutation")]: {
		id: cardId("volatile_transmutation"),
		name: "Transmute Flask",
		range: 0,
		image: "/cards/volatile_transmutation.webp",
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [
			{
				type: "custom_script",
				scriptId: "volatile_transmutation",
				target: "self",
			},
		],
	},
	[cardId("volatile_bolt")]: {
		id: cardId("volatile_bolt"),
		name: "Volatile Bolt",
		range: 10,
		image: "/cards/goblin_magic.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		effects: [
			{
				type: "damage",
				amount: 3,
				target: "anchor",
				projectile: "ACID_SPIT",
				vfx: "ACID_SPIT",
			},
			{
				type: "apply_status",
				status: { type: "poison", amount: 1, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("reckless_experiment")]: {
		id: cardId("reckless_experiment"),
		name: "Reckless Experiment",
		range: 0,
		image: "/cards/reckless_experiment.webp",
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [
			{
				type: "custom_script",
				scriptId: "reckless_experiment",
				target: "self",
			},
		],
	},
	[cardId("spawn_vial")]: {
		id: cardId("spawn_vial"),
		name: "Spawn Vial",
		range: 1,
		image: "/cards/reckless_experiment.webp",
		playRequirement: "no_target",
		aiTargetPreference: "empty_adjacent",
		effects: [
			{
				type: "summon",
				blueprintId: summonId("acid-flask"),
				target: "anchor",
			},
		],
	},
	[cardId("kick_vial")]: {
		id: cardId("kick_vial"),
		name: "Kick Vial",
		range: 1,
		image: "/cards/reckless_experiment.webp",
		playRequirement: "requires_entity",
		aiTargetPreference: "closest",
		effects: [
			{
				type: "push",
				distance: 2,
				collisionDamage: 0,
				target: "anchor",
			},
		],
	},
	[cardId("potion_frenzy")]: {
		id: cardId("potion_frenzy"),
		name: "Potion Frenzy",
		range: 10,
		image: "/cards/reckless_charge.webp",
		playRequirement: "no_target",
		effects: [
			{ type: "damage", amount: 6, target: "path" },
			{
				type: "push",
				distance: 2,
				collisionDamage: 3,
				target: "path",
				pushDirection: "sideways",
			},
			{ type: "move", target: "self" },
			{ type: "custom_script", scriptId: "barnaby_collision", target: "self" },
		],
	},
	[cardId("reckless_charge")]: {
		id: cardId("reckless_charge"),
		name: "Reckless Charge",
		range: 10,
		image: "/cards/reckless_charge.webp",
		playRequirement: "no_target",
		effects: [
			{ type: "damage", amount: 6, target: "path" },
			{
				type: "push",
				distance: 2,
				collisionDamage: 4,
				target: "path",
				pushDirection: "sideways",
			},
			{ type: "move", target: "self" },
		],
	},
};
