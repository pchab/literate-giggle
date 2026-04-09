import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const beastMaster: UnitBlueprint = {
	id: "beast_master" as UnitBlueprint["id"],
	name: "Elven Beastmaster",
	spriteBase: "monsters/beast_master",
	maxHp: 18,
	baseMove: 2,
	baseDef: 0,
	xpReward: 20,
	intentPool: [
		{
			cardId: cardId("elven_horn"),
			weight: 1,
		},
	],
};
