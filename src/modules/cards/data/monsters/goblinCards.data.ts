import { summonId } from "@/modules/figures/helpers/figures.helpers";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const goblinCards: Record<Card["id"], Card> = {
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
				amount: 4,
				target: "anchor",
				projectile: "ACID_SPIT",
				vfx: "ACID_SPIT",
			},
			{
				type: "apply_status",
				status: { type: "poison", amount: 2, duration: 2 },
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
};
