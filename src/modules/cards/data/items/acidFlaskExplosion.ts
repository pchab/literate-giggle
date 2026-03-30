import { crossPattern } from "@/modules/battle/data/attackPattern.data";
import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const acidFlaskExplosionCard: Card = {
	id: cardId("acid_flask_explosion"),
	name: "Acid Spill",
	range: 0,
	image: "/cards/acid_flask_explosion.webp",
	playRequirement: "no_target",
	aiTargetPreference: "self",
	aoePattern: crossPattern,
	effects: [
		{ type: "damage", amount: 3, target: "anchor" },
		{
			type: "apply_status",
			status: { type: "vulnerable", amount: 2, duration: 2 },
			target: "anchor",
		},
		{
			type: "create_surface",
			target: "anchor",
			surfaceType: "ACID",
			duration: 3,
			spriteBase: "/surfaces/acid.webp",
			status: {
				type: "vulnerable",
				amount: 2,
				duration: 2,
			},
		},
	],
};
