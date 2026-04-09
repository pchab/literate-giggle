import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const zombie: UnitBlueprint = {
	id: "zombie" as UnitBlueprint["id"],
	name: "Zombie",
	spriteBase: "monsters/zombie",
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	xpReward: 5,
	intentPool: [
		{
			cardId: cardId("skeleton_slash"),
			weight: 2,
		},
	],
};
