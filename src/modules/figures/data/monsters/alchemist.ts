import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const crazedAlchemist: UnitBlueprint = {
	name: "Alchemist Barnaby",
	spriteBase: "monsters/merchant",
	maxHp: 40,
	baseMove: 2,
	baseDef: 6,
	xpReward: 50,
	intentPool: [
		{
			cardId: cardId("alchemical_frenzy"),
			weight: 1,
		},
	],
};
