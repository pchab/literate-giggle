import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const treant_bruiser: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition"
> = {
	spriteBase: "treant",
	enemyType: "TREANT",
	maxHp: 45,
	baseDef: 2,
	currentBlock: 0,
	baseMove: 1,
	xpReward: 50,
	intentPool: [
		// 100% chance to use the devastating AoE sweep!
		{ cardId: cardId("treant_sweep"), weight: 100 },
	],
};
