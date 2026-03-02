import { CLASS_REGISTRY } from "@/modules/heroClass/domain/heroClass.data";
import type { Hero } from "../figures.type";

export const baseHeroStats: Omit<
	Hero,
	"id" | "gridPosition" | "cards" | "deck" | "currentHp" | "currentBlock"
> = {
	heroClass: CLASS_REGISTRY.HOBO.id,
	spriteBase: CLASS_REGISTRY.HOBO.spriteBase,
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	passives: [],
	currentXp: 0,
	currentLevel: 1,
};
