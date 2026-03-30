import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const giantToad: UnitBlueprint = {
	name: "Giant Toad",
	spriteBase: "monsters/giant_toad",
	maxHp: 60,
	baseMove: 2,
	baseDef: 0,
	xpReward: 60,
	size: 2,
	intentPool: [
		// { cardId: cardId("giant_chomp"), weight: 4 },
		{ cardId: cardId("tongue_lash"), weight: 3 },
		// { cardId: cardId("belly_flop"), weight: 3 },
	],
};
