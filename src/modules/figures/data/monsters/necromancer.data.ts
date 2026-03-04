import { singleTargetPattern } from "@/modules/battle/data/attackPattern.data";
import type { Monster } from "../../domain/figures.type";

export const necromancer: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "plannedAttack"
> = {
	enemyType: "NECROMANCER",
	spriteBase: "monsters/necromancer",
	maxHp: 50,
	baseMove: 2,
	baseDef: 1,
	currentBlock: 0,
	xpReward: 100,
	attacks: [
		{
			id: "necrobolt",
			name: "Necrobolt",
			target: "lowestHp",
			pattern: singleTargetPattern,
			move: 2,
			damage: 4,
			minRange: 2,
			maxRange: 3,
		},
		{
			id: "summon",
			name: "Summon Skeleton",
			target: "self",
			pattern: singleTargetPattern,
			move: 0,
			damage: 0,
			minRange: 0,
			maxRange: 0,
			summonType: "SKELETON",
		},
	],
};
