import {
	cleavePattern,
	crossPattern,
} from "@/modules/battle/data/attackPattern.data";
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
		],
	},
};
