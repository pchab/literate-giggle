import { singleTargetPattern } from "@/modules/attacks/attacks";
import type { Monster } from "../figures.type";

export const archer: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "intent"
> = {
	enemyType: "ARCHER",
	spriteBase: "archer",
	maxHp: 10,
	physDef: 0,
	magDef: 0,
	attacks: [
		{
			id: 1,
			target: "lowestHp",
			pattern: singleTargetPattern,
			move: 1,
			damage: 3,
			minRange: 1,
			maxRange: 3,
			effect: "physDmg",
		},
		{
			id: 2,
			target: "lowestPhysDef",
			pattern: singleTargetPattern,
			move: 0,
			damage: 4,
			minRange: 2,
			maxRange: 4,
			effect: "physDmg",
		},
	],
};
