import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const goblin: UnitBlueprint = {
	spriteBase: "monsters/goblin",
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	xpReward: 6,
	intentPool: [
		{
			cardId: cardId("monster_melee_attack"),
			weight: 2,
		},
		{
			cardId: cardId("bandage"),
			weight: 1,
		},
	],
};
