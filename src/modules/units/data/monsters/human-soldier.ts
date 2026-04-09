import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const humanSoldier: UnitBlueprint = {
	id: "iron_footman" as UnitBlueprint["id"],
	name: "Iron Footman",
	spriteBase: "monsters/human_soldier",
	maxHp: 20,
	baseMove: 2,
	baseDef: 1,
	xpReward: 30,
	intentPool: [
		{
			cardId: cardId("shield_wall"),
			weight: 1,
		},
		{
			cardId: cardId("iron_sword"),
			weight: 2,
		},
	],
};
