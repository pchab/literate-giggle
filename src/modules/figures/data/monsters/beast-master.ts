import { cardId } from "@/modules/cards/helpers/cards.helper";
import { type Monster, UnitStance } from "../../domain/figures.type";

export const beastMaster: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/beast_master",
	stance: UnitStance.IDLE,
	maxHp: 18,
	baseMove: 2,
	baseDef: 0,
	xpReward: 20,
	intentPool: [
		{
			cardId: cardId("elven_horn"),
			weight: 1,
		},
	],
};
