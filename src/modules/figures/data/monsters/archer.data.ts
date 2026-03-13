import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const archer: UnitBlueprint = {
	spriteBase: "monsters/archer",
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	xpReward: 10,
	intentPool: [
		{
			cardId: cardId("short_bow"),
			weight: 1,
		},
	],
};
