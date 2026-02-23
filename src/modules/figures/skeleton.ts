import { crossPattern, linePattern } from "./attacks";
import type { Monster } from "./figures.type";

export const skeleton: Monster = {
	id: 1,
	enemyType: "Skeleton",
	currentHp: 10,
	maxHp: 10,
	attacks: [
		{
			id: 1,
			target: "lowestHp",
			pattern: crossPattern,
			damage: 3,
			effect: "physDmg",
		},
		{
			id: 2,
			target: "lowestPhysDef",
			pattern: linePattern,
			damage: 4,
			effect: "physDmg",
		},
	],
	intent: {
		id: 1,
		target: "lowestHp",
		pattern: crossPattern,
		damage: 3,
		effect: "physDmg",
	},
};
