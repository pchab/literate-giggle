import {
	singleTargetPattern,
	squarePattern,
} from "@/modules/battle/data/attackPattern.data";
import type { Monster } from "../../domain/figures.type";

export const stone_elemental: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "plannedAttack"
> = {
	enemyType: "GOLEM",
	spriteBase: "monsters/stone_elemental",
	maxHp: 20,
	baseMove: 1, // Very slow!
	baseDef: 2, // Hard to crack
	currentBlock: 0,
	xpReward: 15,
	attacks: [
		{
			id: 1,
			target: "lowestHp",
			pattern: singleTargetPattern,
			move: 1,
			damage: 5,
			minRange: 1,
			maxRange: 1,
		},
	],
};

export const golem_overseer: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "plannedAttack"
> = {
	enemyType: "GOLEM_OVERSEER",
	spriteBase: "monsters/golem_overseer",
	maxHp: 60,
	baseMove: 1,
	baseDef: 3,
	currentBlock: 0,
	xpReward: 150,
	attacks: [
		{
			id: 1,
			target: "closest",
			pattern: squarePattern,
			move: 1,
			damage: 8,
			minRange: 1,
			maxRange: 1,
		},
	],
};
