import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const stone_elemental: UnitBlueprint = {
	name: "Stone Elemental",
	spriteBase: "monsters/stone_elemental",
	maxHp: 20,
	baseMove: 1,
	baseDef: 2,
	xpReward: 15,
	intentPool: [
		{
			cardId: cardId("fist_slam"),
			weight: 2,
		},
		{
			cardId: cardId("hurl_boulder"),
			weight: 1,
		},
	],
};

export const golem_overseer: UnitBlueprint = {
	name: "Golem Overseer",
	spriteBase: "monsters/golem_overseer",
	maxHp: 60,
	baseMove: 1,
	baseDef: 3,
	xpReward: 150,
	intentPool: [
		{
			cardId: cardId("fist_slam"),
			weight: 2,
		},
		{
			cardId: cardId("hardened_stone"),
			weight: 1,
		},
	],
};
