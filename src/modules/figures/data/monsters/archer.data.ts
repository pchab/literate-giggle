import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const archer: Omit<Monster, "id" | "currentHp" | "gridPosition"> = {
	enemyType: "ARCHER",
	spriteBase: "monsters/archer",
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	currentBlock: 0,
	xpReward: 10,
	intentPool: [
		{
			cardId: cardId("monster_ranged_attack"),
			weight: 1,
		},
	],
};
