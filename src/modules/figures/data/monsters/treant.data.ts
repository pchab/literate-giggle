import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const treant_bruiser: UnitBlueprint = {
	name: "Treant",
	spriteBase: "monsters/treant",
	maxHp: 45,
	baseDef: 2,
	baseMove: 1,
	xpReward: 50,
	intentPool: [{ cardId: cardId("treant_sweep"), weight: 100 }],
};
