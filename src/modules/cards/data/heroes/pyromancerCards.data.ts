import { crossPattern } from "@/modules/battle/data/attackPattern.data";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const pyromancerCards: Record<Card["id"], Card> = {
	[cardId("pyromancer_placeholder")]: {
		id: cardId("pyromancer_placeholder"),
		name: "Pyromancer Placeholder",
		range: 1,
		image: "/cards/pyromancer.webp",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("fireball")]: {
		id: cardId("fireball"),
		name: "Fireball",
		range: 2,
		image: "/cards/fireball.webp",
		playRequirement: "requires_enemy",
		aoePattern: crossPattern,
		effects: [
			{
				type: "damage",
				amount: 6,
				target: "anchor",
				projectile: "FIREBALL",
				vfx: "FIRE",
			},
		],
	},
};
