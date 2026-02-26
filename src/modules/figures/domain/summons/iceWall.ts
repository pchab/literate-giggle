import type { Summon } from "../figures.type";

export const iceWall: Omit<
	Summon,
	"id" | "currentHp" | "gridPosition" | "allegiance"
> = {
	name: "Ice Wall",
	spriteBase: "ice_wall",
	maxHp: 10,
	physDef: 0,
	magDef: 0,
};
