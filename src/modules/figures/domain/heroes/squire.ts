import type { Hero } from "../figures.type";

export const squireStats: Omit<
	Hero,
	"id" | "gridPosition" | "cards" | "deck" | "currentHp" | "currentBlock"
> = {
	spriteBase: "squire",
	heroClass: "SQUIRE",
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
};
