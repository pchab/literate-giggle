import type { Summon } from "../../domain/figures.type";

export const iceWall: Omit<
	Summon,
	"id" | "currentHp" | "gridPosition" | "allegiance"
> = {
	name: "Ice Wall",
	spriteBase: "summons/ice_wall",
	maxHp: 10,
	baseMove: 0,
	baseDef: 0,
	currentBlock: 0,
};
