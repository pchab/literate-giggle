import { summonId } from "@/modules/figures/helpers/figures.helpers";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";
import { elvenCards } from "./elvenCards.data";
import { ironholdCards } from "./ironholdCards.data";

export const monsterCardLibrary: Record<Card["id"], Card> = {
	// BASIC MONSTER CARDS (Shared)
	[cardId("monster_melee_attack")]: {
		id: cardId("monster_melee_attack"),
		name: "Basic Attack",
		range: 1,
		image: "",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		effects: [{ type: "damage", amount: 3, target: "anchor" }],
	},
	[cardId("monster_ranged_attack")]: {
		id: cardId("monster_ranged_attack"),
		name: "Basic Ranged Attack",
		range: 2,
		image: "",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		effects: [
			{ type: "damage", amount: 2, target: "anchor", projectile: "ARROW" },
		],
	},
	// --- RAT CARD ---
	[cardId("rat_bite")]: {
		id: cardId("rat_bite"),
		name: "Rat Bite",
		range: 1,
		image: "/cards/rat_bite.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		effects: [{ type: "damage", amount: 2, target: "anchor" }],
	},
	[cardId("nasty_bite")]: {
		id: cardId("nasty_bite"),
		name: "Nasty Bite",
		range: 1,
		image: "/cards/nasty_bite.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: { col: 2, row: 2 },
		effects: [
			{ type: "damage", amount: 2, target: "anchor" },
			{
				type: "apply_status",
				status: { type: "poison", amount: 3, duration: 2 },
				target: "anchor",
			},
		],
	},
	[cardId("call_more_rats")]: {
		id: cardId("call_more_rats"),
		name: "Call more rats",
		range: 1,
		image: "/cards/call_rat.webp",
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [
			{
				type: "custom_script",
				scriptId: "trapdoor_spawn",
				target: "self",
				payload: { spawnCount: 2, blueprintId: summonId("rat") },
			},
		],
	},

	// --- SKELETON CARDS ---
	[cardId("skeleton_slash")]: {
		id: cardId("skeleton_slash"),
		name: "Rusty Blade",
		range: 1,
		image: "/cards/skeleton_slash.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("bone_guard")]: {
		id: cardId("bone_guard"),
		name: "Bone Guard",
		range: 0,
		image: "/cards/bone_guard.webp",
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [
			{
				type: "apply_status",
				status: {
					type: "temp_block",
					amount: 5,
					duration: 1,
				},
				target: "self",
			},
		],
	},

	// --- NECROMANCER CARDS ---
	[cardId("necrobolt")]: {
		id: cardId("necrobolt"),
		name: "Necrobolt",
		range: 3,
		image: "/cards/necrobolt.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		effects: [
			{
				type: "damage",
				amount: 6,
				target: "anchor",
				projectile: "NECROBOLT",
				vfx: "NECROTIC_IMPACT",
			},
		],
	},
	[cardId("skeleton_summon")]: {
		id: cardId("skeleton_summon"),
		name: "Raise the dead",
		range: 1,
		image: "/cards/raise_skeleton.webp",
		playRequirement: "requires_empty_cell",
		aiTargetPreference: "away",
		effects: [
			{ type: "summon", blueprintId: summonId("skeleton"), target: "anchor" },
		],
	},

	// --- SUMMON CARDS ---
	[cardId("wisp_zap")]: {
		id: cardId("wisp_zap"),
		name: "Wisp Zap",
		range: 2,
		image: "/cards/wisp_zap.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		effects: [{ type: "damage", amount: 2, target: "anchor" }],
	},
	[cardId("briar_bite")]: {
		id: cardId("briar_bite"),
		name: "Briar Bite",
		range: 1,
		image: "/cards/briar_bite.webp",
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		effects: [
			{ type: "damage", amount: 3, target: "anchor" },
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

	...elvenCards,
	...ironholdCards,
};
