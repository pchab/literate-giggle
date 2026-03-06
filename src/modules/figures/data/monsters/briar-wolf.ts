import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const briarWolf: Omit<Monster, "id" | "currentHp" | "gridPosition"> = {
	enemyType: "BRIAR_WOLF",
	spriteBase: "monsters/briar_wolf",
	maxHp: 8,
	baseMove: 3,
	baseDef: 0,
	currentBlock: 0,
	xpReward: 5,
	intentPool: [
		{
			cardId: cardId("monster_melee_attack"),
			weight: 1,
		},
	],
};
