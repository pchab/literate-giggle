import type { Hero } from "../figures.type";

export const squireStats: Omit<
	Hero,
	"currentHp" | "id" | "gridPosition" | "cards" | "deck"
> = {
	spriteBase: "squire",
	heroClass: "SQUIRE",
	maxHp: 10,
	physAtk: 1,
	physDef: 1,
	magAtk: 1,
	magDef: 1,
	currentMagBlock: 0,
	currentPhysBlock: 0,
};
