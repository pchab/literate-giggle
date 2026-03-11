import { cardId } from "@/modules/cards/helpers/cards.helper";
import { type Monster, UnitStance } from "../../domain/figures.type";

export const archer: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/archer",
	stance: UnitStance.IDLE,
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	xpReward: 10,
	intentPool: [
		{
			cardId: cardId("monster_ranged_attack"),
			weight: 1,
		},
	],
};
