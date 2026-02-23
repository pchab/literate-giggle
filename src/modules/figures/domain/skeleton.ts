import { crossPattern, linePattern } from "../attacks";
import type { Monster } from "./figures.type";

export const skeleton: Omit<Monster, "currentHp" | "gridPosition"> = {
	id: 1,
	enemyType: "Skeleton",
	maxHp: 10,
	attacks: [
		{
			id: 1,
			target: "lowestHp",
			pattern: crossPattern,
			move: 2,
			damage: 2,
			effect: "physDmg",
		},
		{
			id: 2,
			target: "lowestPhysDef",
			pattern: linePattern,
			move: 2,
			damage: 2,
			effect: "physDmg",
		},
	],
	intent: {
		id: 1,
		target: "lowestHp",
		pattern: crossPattern,
		move: 2,
		damage: 2,
		effect: "physDmg",
	},
};
