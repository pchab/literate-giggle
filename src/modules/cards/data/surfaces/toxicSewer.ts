import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const toxicSewer: Card = {
	id: cardId("toxic_sewer"),
	name: "Toxic Sewer",
	range: 0,
	image: "/cards/toxic_sewer.webp",
	playRequirement: "no_target",
	effects: [{ type: "damage", amount: 1, target: "anchor" }],
};
