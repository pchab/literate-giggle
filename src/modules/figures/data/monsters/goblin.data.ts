import { cardId } from "@/modules/cards/helpers/cards.helper";
import { type Monster, UnitStance } from "../../domain/figures.type";

export const goblin: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/goblin",
	stance: UnitStance.IDLE,
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	xpReward: 6,
	intentPool: [
		{
			cardId: cardId("monster_melee_attack"),
			weight: 1,
		},
		{
			cardId: cardId("bandage"),
			weight: 1,
		},
	],
};
