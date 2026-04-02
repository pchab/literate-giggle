import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const rat: UnitBlueprint = {
	name: "Rat",
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
	name: "Rat King",
	spriteBase: "monsters/rat_boss",
	maxHp: 9,
	baseMove: 2,
	baseDef: 0,
	xpReward: 9,
	intentPool: [
		{
			cardId: cardId("call_more_rats"),
			weight: 1,
		},
	],
};
