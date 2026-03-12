import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const skeleton: UnitBlueprint = {
	spriteBase: "monsters/skeleton",
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	xpReward: 5,
	intentPool: [
		{
			cardId: cardId("skel_slash"),
			weight: 2,
		},
		{
			cardId: cardId("skel_guard"),
			weight: 1,
		},
	],
};
