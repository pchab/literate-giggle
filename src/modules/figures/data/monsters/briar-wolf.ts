import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const briarWolf: UnitBlueprint = {
	name: "Briar Wolf",
	spriteBase: "monsters/briar_wolf",
	maxHp: 8,
	baseMove: 3,
	baseDef: 0,
	xpReward: 5,
	intentPool: [
		{
			cardId: cardId("briar_bite"),
			weight: 1,
		},
	],
};
