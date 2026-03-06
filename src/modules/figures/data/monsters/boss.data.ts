import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const testBoss: Omit<
	Monster,
	"id" | "currentHp" | "currentBlock" | "gridPosition"
> = {
	spriteBase: "monsters/boss",
	maxHp: 20,
	baseMove: 2,
	baseDef: 1,
	xpReward: 20,
	intentPool: [
		{
			cardId: cardId("monster_ranged_attack"),
			weight: 1,
		},
	],
};
