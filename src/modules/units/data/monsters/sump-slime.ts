import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const sumpSlime: UnitBlueprint = {
	id: "sump_slime" as UnitBlueprint["id"],
	name: "Sump Slime",
	spriteBase: "monsters/slime",
	maxHp: 20,
	baseMove: 2,
	baseDef: 0,
	xpReward: 5,
	intentPool: [
		{
			cardId: cardId("monster_melee_attack"),
			weight: 1,
		},
	],
};
export const sumpWatcher: UnitBlueprint = {
	id: "sump_watcher" as UnitBlueprint["id"],
	name: "Sump Watcher",
	hint: "Attacks only split it into slimes. It dissolves 20 HP every turn: survive, and brace against crates when it flushes the sewer.",
	spriteBase: "monsters/sewer_boss",
	maxHp: 100,
	baseMove: 0,
	baseDef: 10,
	xpReward: 100,
	size: { cols: 2, rows: 2 },
	intentPool: [
		{
			cardId: cardId("sewer_flush"),
			weight: 1,
		},
	],
};
