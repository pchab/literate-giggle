import { summonId } from "@/modules/units/helpers/units.helpers";
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
				payload: undefined,
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
		range: 3,
		image: "/cards/reckless_experiment.webp",
		playRequirement: "no_target",
		aiTargetPreference: "away",
		effects: [
			{
				type: "custom_script",
				scriptId: "reckless_experiment",
				target: "self",
				payload: undefined,
			},
		],
	},
	[cardId("spawn_vial")]: {
		id: cardId("spawn_vial"),
		name: "Spawn Vial",
		range: 1,
		image: "/cards/reckless_experiment.webp",
		playRequirement: "requires_empty_cell",
		aiTargetPreference: "self",
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
	[cardId("alchemical_frenzy")]: {
		id: cardId("alchemical_frenzy"),
		name: "Alchemical Frenzy",
		range: 0,
		image: "/cards/reckless_charge.webp",
		aiTargetPreference: "self",
		playRequirement: "no_target",
		effects: [
			{
				type: "custom_script",
				scriptId: "alchemical_frenzy",
				target: "self",
				payload: undefined,
			},
		],
	},
	[cardId("reckless_charge")]: {
		id: cardId("reckless_charge"),
		name: "Reckless Charge",
		range: 10,
		image: "/cards/reckless_charge.webp",
		playRequirement: "no_target",
		effects: [
			{
				type: "charge",
				distance: 2,
				collisionDamage: 2,
				target: "anchor",
			},
		],
	},
};
