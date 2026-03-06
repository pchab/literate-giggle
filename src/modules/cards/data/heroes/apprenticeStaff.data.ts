import type { Card } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";

const apprenticeStaffBase: Pick<
	Card,
	"name" | "range" | "image" | "playRequirement"
> = {
	name: "Apprentice Staff",
	range: 2,
	image: "/cards/apprentice-staff.png",
	playRequirement: "requires_enemy",
};

export const apprenticeStaffCards: Record<Card["id"], Card> = {
	[cardId("apprentice-staff-1")]: {
		id: cardId("apprentice-staff-1"),
		...apprenticeStaffBase,
		effects: [{ type: "damage", amount: 4, target: "anchor" }],
	},
	[cardId("apprentice-staff-2")]: {
		id: cardId("apprentice-staff-2"),
		...apprenticeStaffBase,
		effects: [{ type: "damage", amount: 5, target: "anchor" }],
	},
	[cardId("apprentice-staff-3")]: {
		id: cardId("apprentice-staff-3"),
		...apprenticeStaffBase,
		effects: [{ type: "damage", amount: 6, target: "anchor" }],
	},
};
