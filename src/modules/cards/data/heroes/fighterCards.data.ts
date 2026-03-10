import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const fighterCards: Record<Card["id"], Card> = {
	[cardId("short-sword")]: {
		id: cardId("short-sword"),
		name: "Short Sword",
		range: 1,
		image: "/cards/short-sword.png",
		playRequirement: "requires_enemy",
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("battle-cry")]: {
		id: cardId("battle-cry"),
		name: "Battle Cry",
		range: 1,
		image: "/cards/battle-cry.png",
		playRequirement: "requires_enemy",
		effects: [
			{ type: "push", distance: 2, collisionDamage: 3, target: "anchor" },
		],
	},
	[cardId("shield-block")]: {
		id: cardId("shield-block"),
		name: "Shield Block",
		range: 0,
		image: "/cards/shield-block.png",
		playRequirement: "no_target",
		effects: [
			{
				type: "apply_status",
				status: {
					type: "temp_block",
					amount: 4,
					duration: 1,
				},
				target: "self",
			},
		],
	},
};
