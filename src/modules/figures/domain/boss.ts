import { conePattern, crossPattern } from "../../attacks/attacks";
import type { Monster } from "./figures.type";

export const testBoss: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "plannedAttack"
> = {
	enemyType: "BOSS",
	maxHp: 20,
	physDef: 1,
	magDef: 1,
	attacks: [
		{
			id: 1,
			target: "lowestHp",
			pattern: crossPattern,
			move: 2,
			damage: 3,
			minRange: 1,
			maxRange: 1,
			effect: "physDmg",
		},
		{
			id: 2,
			target: "lowestPhysDef",
			pattern: conePattern,
			move: 2,
			damage: 4,
			minRange: 1,
			maxRange: 1,
			effect: "physDmg",
		},
	],
};
