import { cardId } from "@/modules/cards/helpers/cards.helper";
import { type Monster, UnitStance } from "../../domain/figures.type";

export const rat: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/rat",

	stance: UnitStance.IDLE,
	maxHp: 3,
	baseMove: 2,
	baseDef: 0,
	xpReward: 3,
	intentPool: [
		{
			cardId: cardId("rat-bite"),
			weight: 1,
		},
	],
};
