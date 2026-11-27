import {
	cleavePattern,
	crossPattern,
} from "@/modules/battle/data/attackPattern.data";
import { summonId } from "@/modules/units/helpers/units.helpers";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const dwarvenPassageCards: Record<Card["id"], Card> = {
	[cardId("fist_slam")]: {
		id: cardId("fist_slam"),
		name: "Fist Slam",
		image: "/cards/fist_slam.webp",
		range: 0,
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		aoePattern: cleavePattern,
		effects: [{ type: "damage", amount: 7, target: "anchor" }],
	},
	[cardId("rubble_punch")]: {
		id: cardId("rubble_punch"),
		name: "Rubble Punch",
		image: "/cards/fist_slam.webp",
		range: 1,
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("hurl_boulder")]: {
		id: cardId("hurl_boulder"),
		name: "Hurl Boulder",
		image: "/cards/hurl_boulder.webp",
		range: 2,
		playRequirement: "requires_enemy",
		aiTargetPreference: "lowestHp",
		aoePattern: crossPattern,
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
	[cardId("ceiling_collapse")]: {
		id: cardId("ceiling_collapse"),
		name: "Bring Down the Ceiling",
		image: "/cards/hurl_boulder.webp",
		range: 0,
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [
			{
				type: "custom_script",
				scriptId: "ceiling_collapse",
				target: "self",
				payload: { tiles: 2, damage: 5, boulderId: summonId("boulder") },
				description:
					"Marks the tiles under the 2 closest heroes. Next turn rocks fall there: 5 damage that ignores armour, then a boulder lands on each empty tile.",
			},
			{
				type: "custom_script",
				scriptId: "advance",
				target: "self",
				payload: { steps: 2 },
				description: "Then it walks up to 2 tiles toward the nearest hero.",
			},
		],
	},
	[cardId("cave_in")]: {
		id: cardId("cave_in"),
		name: "Cave-In",
		image: "/cards/hurl_boulder.webp",
		range: 0,
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [
			{
				type: "custom_script",
				scriptId: "ceiling_collapse",
				target: "self",
				payload: { tiles: 3, damage: 5, boulderId: summonId("boulder") },
				description:
					"Marks the tiles under the 3 closest heroes. Next turn rocks fall there: 5 damage that ignores armour, then a boulder lands on each empty tile.",
			},
			{
				type: "custom_script",
				scriptId: "advance",
				target: "self",
				payload: { steps: 2 },
				description: "Then it walks up to 2 tiles toward the nearest hero.",
			},
		],
	},
	[cardId("seismic_slam")]: {
		id: cardId("seismic_slam"),
		name: "Seismic Slam",
		image: "/cards/fist_slam.webp",
		range: 0,
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [
			{
				type: "custom_script",
				scriptId: "seismic_slam",
				target: "self",
				payload: { radius: 2, damage: 6 },
				description:
					"Marks every tile within 2 of the Golem. Next turn: 6 damage to anything still there, its own allies included.",
			},
			{
				type: "custom_script",
				scriptId: "advance",
				target: "self",
				payload: { steps: 2 },
				description: "Then it walks up to 2 tiles toward the nearest hero.",
			},
		],
	},
	[cardId("hardened_stone")]: {
		id: cardId("hardened_stone"),
		name: "Hardened Stone",
		image: "/cards/hardened_stone.webp",
		range: 0,
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [
			{
				type: "apply_status",
				status: { type: "block", amount: 6, duration: 2 },
				target: "anchor",
			},
			{
				type: "custom_script",
				scriptId: "advance",
				target: "self",
				payload: { steps: 2 },
				description: "Then it walks up to 2 tiles toward the nearest hero.",
			},
		],
	},
};
