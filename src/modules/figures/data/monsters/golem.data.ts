import { cardId } from "@/modules/cards/helpers/cards.helper";
import { type Monster, UnitStance } from "../../domain/figures.type";

export const stone_elemental: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/stone_elemental",
	stance: UnitStance.IDLE,
	maxHp: 20,
	baseMove: 1, // Very slow!
	baseDef: 2, // Hard to crack
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
	"id" | "currentHp" | "gridPosition" | "statuses"
> = {
	spriteBase: "monsters/golem_overseer",
	stance: UnitStance.IDLE,
	maxHp: 60,
	baseMove: 1,
	baseDef: 3,
	xpReward: 150,
	intentPool: [
		{
			cardId: cardId("monster_ranged_attack"),
			weight: 1,
		},
	],
};
