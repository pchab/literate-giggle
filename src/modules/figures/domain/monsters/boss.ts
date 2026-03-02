import { conePattern, crossPattern } from "@/modules/attacks/attacks";
import type { Monster } from "../figures.type";

export const testBoss: Omit<
	Monster,
	"id" | "currentHp" | "gridPosition" | "plannedAttack"
> = {
	enemyType: "BOSS",
	spriteBase: "monsters/boss",
	maxHp: 20,
	baseMove: 2,
	baseDef: 1,
	currentBlock: 0,
	xpReward: 20,
	attacks: [
		{
			id: 1,
			target: "lowestHp",
			pattern: crossPattern,
			move: 2,
			damage: 3,
			minRange: 1,
			maxRange: 1,
		},
		{
			id: 2,
			target: "lowestDef",
			pattern: conePattern,
			move: 2,
			damage: 4,
			minRange: 1,
			maxRange: 1,
		},
	],
};
