import { singleTargetPattern } from "@/modules/battle/data/attackPattern.data";
import type { Monster } from "../../domain/figures.type";

export const treant: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "intent"
> = {
	enemyType: "TREANT",
	spriteBase: "monsters/treant",
	maxHp: 25,
	baseMove: 1,
	baseDef: 0,
	currentBlock: 5,
	xpReward: 10,
	attacks: [
		{
			id: "timber_shove",
			name: "Timber Shove",
			target: "lowestHp",
			pattern: singleTargetPattern,
			move: 1,
			damage: 3,
			minRange: 1,
			maxRange: 1,
		},
	],
};
