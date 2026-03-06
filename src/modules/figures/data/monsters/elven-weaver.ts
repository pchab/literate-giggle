import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const elvenWeaver: Omit<Monster, "id" | "currentHp" | "gridPosition"> = {
	enemyType: "ELVEN_WEAVER",
	spriteBase: "monsters/elven_weaver",
	maxHp: 12,
	baseMove: 3,
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
