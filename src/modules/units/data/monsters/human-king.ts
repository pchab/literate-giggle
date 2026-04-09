import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const humanKing: UnitBlueprint = {
	id: "king" as UnitBlueprint["id"],
	name: "King Tanotalos II",
	spriteBase: "monsters/human_king",
	maxHp: 80,
	baseMove: 2,
	baseDef: 2,
	xpReward: 200,
	intentPool: [
		{
			cardId: cardId("royal_command"),
			weight: 1,
		},
		{
			cardId: cardId("great_sword"),
			weight: 2,
		},
	],
};
