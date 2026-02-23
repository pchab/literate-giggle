import { crossPattern, linePattern } from "../attacks";
import type { Monster } from "./figures.type";

export const archer: Omit<Monster, "currentHp" | "gridPosition"> = {
	id: 1,
	enemyType: "Archer",
	maxHp: 10,
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
			pattern: linePattern,
			move: 0,
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
