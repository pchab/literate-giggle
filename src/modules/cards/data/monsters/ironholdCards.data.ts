import { cleavePattern } from "@/modules/battle/data/attackPattern.data";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const ironholdCards: Record<Card["id"], Card> = {
	[cardId("royal_command")]: {
		id: cardId("royal_command"),
		name: "Royal Command",
		image: "/cards/royal_command.webp",
		range: 0,
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [
			{
				type: "apply_status",
				status: { type: "temp_block", amount: 3, duration: 1 },
				target: "all_allies",
			},
		],
	},
	[cardId("great_sword")]: {
		id: cardId("great_sword"),
		name: "Great Sword",
		image: "/cards/great_sword.webp",
		range: 1,
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		aoePattern: cleavePattern,
		effects: [{ type: "damage", amount: 8, target: "anchor" }],
	},
	[cardId("iron_sword")]: {
		id: cardId("iron_sword"),
		name: "Iron Sword",
		image: "/cards/iron_sword.webp",
		range: 1,
		playRequirement: "requires_enemy",
		aiTargetPreference: "closest",
		effects: [{ type: "damage", amount: 5, target: "anchor" }],
	},
	[cardId("shield_wall")]: {
		id: cardId("shield_wall"),
		name: "Shield Wall",
		image: "/cards/shield_wall.webp",
		range: 0,
		playRequirement: "no_target",
		aiTargetPreference: "self",
		effects: [
			{
				type: "apply_status",
				status: { type: "temp_block", amount: 4, duration: 1 },
				target: "self",
			},
		],
	},
};
