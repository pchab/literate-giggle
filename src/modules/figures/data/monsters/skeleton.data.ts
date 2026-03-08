import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const skeleton: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/skeleton",
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	xpReward: 10,
	intentPool: [
		{
			cardId: cardId("skel_slash"),
			weight: 2,
		},
		{
			cardId: cardId("skel_guard"),
			weight: 1,
		},
	],
};
