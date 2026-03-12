import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const elvenWeaver: UnitBlueprint = {
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
