import { conePattern, crossPattern } from "../attacks";
import type { Monster } from "./figures.type";

export const testBoss: Omit<Monster, "currentHp" | "gridPosition"> = {
	id: 1,
	enemyType: "Boss",
	maxHp: 20,
	attacks: [
		{
			id: 1,
			target: "lowestHp",
			pattern: crossPattern,
			move: 1,
			damage: 3,
			effect: "physDmg",
		},
		{
			id: 2,
			target: "lowestPhysDef",
			pattern: conePattern,
			move: 1,
			damage: 4,
			effect: "physDmg",
		},
	],
	intent: {
		id: 1,
		target: "lowestHp",
		pattern: crossPattern,
		move: 1,
		damage: 3,
		effect: "physDmg",
	},
};
