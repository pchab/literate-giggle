import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const bat: Omit<Monster, "id" | "currentHp" | "gridPosition"> = {
	enemyType: "BAT",
	spriteBase: "monsters/bat",
	maxHp: 6,
	baseMove: 4,
	baseDef: 0,
	currentBlock: 0,
	xpReward: 6,
	intentPool: [
		{
			cardId: cardId("monster_melee_attack"),
			weight: 1,
		},
	],
};
