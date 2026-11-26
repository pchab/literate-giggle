import { PASSIVE_IDS } from "@/modules/units/data/passiveIds.data";
import { CLASS_REGISTRY } from "../../data/heroClass.data";
import type { Hero } from "../../domain/units.type";

export const baseHeroStats: Omit<
	Hero,
	| "id"
	| "name"
	| "gridPosition"
	| "selectedCards"
	| "deck"
	| "currentHp"
	| "statuses"
	| "variant"
> = {
	heroClass: CLASS_REGISTRY.HOBO.id,
	spriteBase: CLASS_REGISTRY.HOBO.spriteBase,
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	passives: [PASSIVE_IDS.scavenger],
	currentXp: 0,
	currentLevel: 1,
};
