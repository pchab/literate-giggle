import { singleTargetPattern } from "@/modules/attacks/attacks";
import type { Monster } from "../figures.type";

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
			id: 1,
			target: "lowestHp",
			pattern: singleTargetPattern,
			move: 2,
			damage: 4,
			minRange: 3,
			maxRange: 3,
		},
	],
};
