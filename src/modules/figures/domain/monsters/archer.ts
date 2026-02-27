import { singleTargetPattern } from "@/modules/attacks/attacks";
import type { Monster } from "../figures.type";

export const archer: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "intent"
> = {
	enemyType: "ARCHER",
	spriteBase: "monsters/archer",
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	currentBlock: 0,
	attacks: [
		{
			id: 1,
			target: "lowestHp",
			pattern: singleTargetPattern,
			move: 1,
			damage: 3,
			minRange: 1,
			maxRange: 3,
		},
		{
			id: 2,
			target: "lowestDef",
			pattern: singleTargetPattern,
			move: 0,
			damage: 4,
			minRange: 2,
			maxRange: 4,
		},
	],
};
