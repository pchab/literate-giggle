import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const villager: UnitBlueprint = {
	name: "Villager",
	spriteBase: "summons/villager",
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	xpReward: 0,
	intentPool: [
		{ cardId: cardId("panic_run"), weight: 7 },
		{ cardId: cardId("cower"), weight: 3 },
	],
};
