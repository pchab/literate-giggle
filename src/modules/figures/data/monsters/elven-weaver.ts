import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const elvenWeaver: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/elven_weaver",
	maxHp: 18,
	baseDef: 0,
	baseMove: 2,
	xpReward: 30,

	intentPool: [
		{ cardId: cardId("weaver_thorn"), weight: 7 },
		{ cardId: cardId("weaver_mend"), weight: 30 },
	],
};
