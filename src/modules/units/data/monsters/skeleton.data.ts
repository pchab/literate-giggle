import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const skeleton: UnitBlueprint = {
	id: "skeleton" as UnitBlueprint["id"],
	name: "Skeleton",
	spriteBase: "monsters/skeleton",
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	xpReward: 5,
	intentPool: [
		{
			cardId: cardId("skeleton_slash"),
			weight: 2,
		},
		{
			cardId: cardId("bone_guard"),
			weight: 1,
		},
	],
};
