import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const archer: UnitBlueprint = {
	name: "Archer",
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
