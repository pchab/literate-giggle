import { singleTargetPattern } from "../../attacks/attacks";
import type { Monster } from "./figures.type";

export const skeleton: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "plannedAttack"
> = {
	enemyType: "Skeleton",
	maxHp: 10,
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
