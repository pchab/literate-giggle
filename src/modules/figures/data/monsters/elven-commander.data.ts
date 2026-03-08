import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const elvenCommander: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/elven_commander",
	maxHp: 24,
	baseDef: 1,
	baseMove: 2,
	xpReward: 100,

	intentPool: [
		{ cardId: cardId("commander_glaive"), weight: 3 },
		{ cardId: cardId("elven_horn"), weight: 2 },
	],
};
