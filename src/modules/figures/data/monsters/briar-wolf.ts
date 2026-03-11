import { cardId } from "@/modules/cards/helpers/cards.helper";
import { type Monster, UnitStance } from "../../domain/figures.type";

export const briarWolf: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/briar_wolf",
	stance: UnitStance.IDLE,
	maxHp: 8,
	baseMove: 3,
	baseDef: 0,
	xpReward: 5,
	intentPool: [
		{
			cardId: cardId("briar_bite"),
			weight: 1,
		},
	],
};
