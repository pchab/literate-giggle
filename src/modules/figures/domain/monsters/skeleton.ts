import { singleTargetPattern } from "@/modules/attacks/attacks";
import type { Monster } from "../figures.type";

export const skeleton: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "plannedAttack"
> = {
	enemyType: "SKELETON",
	spriteBase: "skeleton",
	maxHp: 10,
	physDef: 0,
	magDef: 0,
	attacks: [
		{
			id: 1,
			target: "lowestHp",
			pattern: singleTargetPattern,
			move: 2,
			damage: 2,
			minRange: 1,
			maxRange: 1,
			effect: "physDmg",
		},
		{
			id: 2,
			target: "lowestPhysDef",
			pattern: singleTargetPattern,
			move: 2,
			damage: 2,
			minRange: 1,
			maxRange: 1,
			effect: "physDmg",
		},
	],
};
