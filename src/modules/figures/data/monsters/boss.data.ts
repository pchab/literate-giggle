import { cardId } from "@/modules/cards/helpers/cards.helper";
import { type Monster, UnitStance } from "../../domain/figures.type";

export const testBoss: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/boss",
	stance: UnitStance.IDLE,
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
