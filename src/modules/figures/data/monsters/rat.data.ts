import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const rat: UnitBlueprint = {
	spriteBase: "monsters/rat",
	maxHp: 3,
	baseMove: 2,
	baseDef: 0,
	xpReward: 3,
	intentPool: [
		{
			cardId: cardId("rat_bite"),
			weight: 1,
		},
	],
};

export const ratBoss: UnitBlueprint = {
	spriteBase: "monsters/rat_boss",
	maxHp: 9,
	baseMove: 2,
	baseDef: 0,
	xpReward: 9,
	intentPool: [
		{
			cardId: cardId("nasty_bite"),
			weight: 2,
		},
		{
			cardId: cardId("call_more_rats"),
			weight: 1,
		},
	],
};
