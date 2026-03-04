import {
	conePattern,
	crossPattern,
} from "@/modules/battle/data/attackPattern.data";
import type { Monster } from "../../domain/figures.type";

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
			id: "attack_1",
			name: "Attack 1",
			target: "lowestHp",
			pattern: crossPattern,
			move: 2,
			damage: 3,
			minRange: 1,
			maxRange: 1,
		},
		{
			id: "attack_2",
			name: "Attack 2",
			target: "lowestDef",
			pattern: conePattern,
			move: 2,
			damage: 4,
			minRange: 1,
			maxRange: 1,
		},
	],
};
