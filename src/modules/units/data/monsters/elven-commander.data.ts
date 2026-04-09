import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const elvenCommander: UnitBlueprint = {
	id: "elven_commander" as UnitBlueprint["id"],
	name: "Elven Commander",
	spriteBase: "monsters/elven_commander",
	maxHp: 24,
	baseDef: 1,
	baseMove: 2,
	xpReward: 100,

	intentPool: [
		{ cardId: cardId("commander_glaive"), weight: 3 },
		{ cardId: cardId("elven_horn"), weight: 2 },
	],
};
