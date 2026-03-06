import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const treant_bruiser: Omit<
	Monster,
	"id" | "currentHp" | "currentBlock" | "gridPosition"
> = {
	spriteBase: "treant",
	maxHp: 45,
	baseDef: 2,
	baseMove: 1,
	xpReward: 50,
	intentPool: [
		// 100% chance to use the devastating AoE sweep!
		{ cardId: cardId("treant_sweep"), weight: 100 },
	],
};
