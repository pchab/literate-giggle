import { CLASS_REGISTRY } from "../../data/heroClass.data";
import type { Hero } from "../../domain/figures.type";

export const baseHeroStats: Omit<
	Hero,
	"id" | "gridPosition" | "selectedCards" | "deck" | "currentHp" | "statuses"
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
