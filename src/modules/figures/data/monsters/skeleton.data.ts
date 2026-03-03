import { singleTargetPattern } from "@/modules/battle/data/attackPattern.data";
import type { Monster } from "../../domain/figures.type";

export const skeleton: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "plannedAttack"
> = {
	enemyType: "SKELETON",
	spriteBase: "monsters/skeleton",
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	currentBlock: 0,
	xpReward: 10,
	attacks: [
		{
			id: 1,
			target: "lowestHp",
			pattern: singleTargetPattern,
			move: 2,
			damage: 2,
			minRange: 1,
			maxRange: 1,
		},
		{
			id: 2,
			target: "lowestDef",
			pattern: singleTargetPattern,
			move: 2,
			damage: 2,
			minRange: 1,
			maxRange: 1,
		},
	],
};
