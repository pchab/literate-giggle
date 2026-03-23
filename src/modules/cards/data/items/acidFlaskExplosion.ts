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
		{ type: "damage", amount: 4, target: "self" },
		{
			type: "apply_status",
			status: { type: "vulnerable", amount: 3, duration: 2 },
			target: "self",
		},
		{
			type: "create_surface",
			surfaceType: "ACID",
			duration: -1,
			spriteBase: "/surfaces/acid.webp",
		},
	],
};
