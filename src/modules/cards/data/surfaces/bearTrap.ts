import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const bearTrap: Card = {
	id: cardId("bear_trap"),
	name: "Bear Trap",
	range: 0,
	image: "/surfaces/bear_trap.webp",
	playRequirement: "no_target",
	effects: [
		{ type: "damage", amount: 3, target: "anchor" },
		{
			type: "apply_status",
			status: { type: "rooted", amount: 0, duration: 2 },
			target: "anchor",
		},
	],
};
