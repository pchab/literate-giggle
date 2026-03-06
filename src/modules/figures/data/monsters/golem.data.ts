import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { Monster } from "../../domain/figures.type";

export const stone_elemental: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition"
> = {
	enemyType: "GOLEM",
	spriteBase: "monsters/stone_elemental",
	maxHp: 20,
	baseMove: 1, // Very slow!
	baseDef: 2, // Hard to crack
	currentBlock: 0,
	xpReward: 15,
	intentPool: [
		{
			cardId: cardId("monster_ranged_attack"),
			weight: 1,
		},
	],
};

export const golem_overseer: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition"
> = {
	enemyType: "GOLEM_OVERSEER",
	spriteBase: "monsters/golem_overseer",
	maxHp: 60,
	baseMove: 1,
	baseDef: 3,
	currentBlock: 0,
	xpReward: 150,
	intentPool: [
		{
			cardId: cardId("monster_ranged_attack"),
			weight: 1,
		},
	],
};
