import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

export const mouseTrap: Card = {
	id: cardId("mouse_trap"),
	name: "Mouse Trap",
	range: 0,
	image: "/surfaces/mouse_trap.webp",
	playRequirement: "no_target",
	effects: [{ type: "damage", amount: 3, target: "anchor" }],
};
