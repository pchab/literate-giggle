import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const acidBurn: Card = {
	id: cardId("acid_burn"),
	name: "Acid Burn",
	range: 0,
	image: "/surfaces/acid_burn.webp",
	playRequirement: "no_target",
	effects: [
		{
			type: "apply_status",
			status: { type: "vulnerable", amount: 2, duration: 2 },
			target: "anchor",
		},
	],
};
