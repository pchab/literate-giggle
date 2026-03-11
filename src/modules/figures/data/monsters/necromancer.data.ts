import { cardId } from "@/modules/cards/helpers/cards.helper";
import { type Monster, UnitStance } from "../../domain/figures.type";

export const necromancer: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/necromancer",
	stance: UnitStance.IDLE,
	maxHp: 50,
	baseMove: 2,
	baseDef: 1,
	xpReward: 100,
	intentPool: [
		{
			cardId: cardId("necromancer_bolt"),
			weight: 1,
		},
		{
			cardId: cardId("necromancer_summon"),
			weight: 1,
		},
	],
};
