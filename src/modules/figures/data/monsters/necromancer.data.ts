import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const necromancer: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/necromancer",
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
