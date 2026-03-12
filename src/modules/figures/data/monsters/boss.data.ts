import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const testBoss: UnitBlueprint = {
	spriteBase: "monsters/boss",
	maxHp: 20,
	baseMove: 2,
	baseDef: 1,
	xpReward: 20,
	intentPool: [
		{
			cardId: cardId("monster_ranged_attack"),
			weight: 1,
		},
	],
};
