import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const deadlyHazard: Card = {
	id: cardId("deadly_hazard"),
	name: "Deadly Hazard",
	range: 0,
	image: "/cards/deadly_hazard.webp",
	playRequirement: "no_target",
	effects: [{ type: "damage", amount: 999, target: "anchor" }],
};
