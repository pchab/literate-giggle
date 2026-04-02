import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const archdruid: UnitBlueprint = {
	name: "Archdruid Sylas",
	spriteBase: "monsters/archdruid",
	maxHp: 80,
	baseMove: 3,
	baseDef: 1,
	xpReward: 200,
	intentPool: [
		{
			cardId: cardId("regeneration"),
			weight: 1,
		},
		{
			cardId: cardId("overgrowth"),
			weight: 1,
		},
		{
			cardId: cardId("poison_spores"),
			weight: 2,
		},
	],
};
