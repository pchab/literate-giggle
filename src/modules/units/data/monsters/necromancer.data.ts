import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const necromancer: UnitBlueprint = {
	id: "necromancer" as UnitBlueprint["id"],
	name: "Necromancer",
	spriteBase: "monsters/necromancer",
	maxHp: 50,
	baseMove: 2,
	baseDef: 1,
	xpReward: 100,
	intentPool: [
		{
			cardId: cardId("necrobolt"),
			weight: 1,
		},
		{
			cardId: cardId("skeleton_summon"),
			weight: 2,
		},
	],
};
