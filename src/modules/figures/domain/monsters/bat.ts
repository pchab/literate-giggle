import { singleTargetPattern } from "@/modules/attacks/attacks";
import type { Monster } from "../figures.type";

export const bat: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "plannedAttack"
> = {
	enemyType: "BAT",
	spriteBase: "monsters/bat",
	maxHp: 6,
	baseMove: 4,
	baseDef: 0,
	currentBlock: 0,
	attacks: [
		{
			id: 1,
			target: "lowestHp",
			pattern: singleTargetPattern,
			move: 4,
			damage: 2,
			minRange: 1,
			maxRange: 1,
		},
		{
			id: 2,
			target: "lowestDef",
			pattern: singleTargetPattern,
			move: 4,
			damage: 2,
			minRange: 1,
			maxRange: 1,
		},
	],
};
