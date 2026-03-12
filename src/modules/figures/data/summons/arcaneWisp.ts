import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const arcaneWisp: UnitBlueprint = {
	spriteBase: "summons/arcane_wisp",
	maxHp: 5,
	baseDef: 0,
	baseMove: 3,
	xpReward: 4,
	intentPool: [{ cardId: cardId("wisp_zap"), weight: 1 }],
};
