import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const bat: UnitBlueprint = {
	id: "giant_bat" as UnitBlueprint["id"],
	name: "Giant Bat",
	spriteBase: "monsters/bat",
	maxHp: 6,
	baseMove: 4,
	baseDef: 0,
	xpReward: 6,
	intentPool: [
		{
			cardId: cardId("monster_melee_attack"),
			weight: 1,
		},
	],
};
