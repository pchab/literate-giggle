import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const beastMaster: Omit<
	Monster,
	"id" | "currentHp" | "currentBlock" | "gridPosition"
> = {
	spriteBase: "monsters/beast_master",
	maxHp: 18,
	baseMove: 2,
	baseDef: 0,
	xpReward: 20,
	intentPool: [
		{
			cardId: cardId("monster_melee_attack"),
			weight: 1,
		},
	],
};
