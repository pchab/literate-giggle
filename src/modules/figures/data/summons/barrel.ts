import type { UnitBlueprint } from "../../domain/figures.type";

export const barrel: UnitBlueprint = {
	spriteBase: "summons/barrel",
	maxHp: 10,
	baseMove: 0,
	baseDef: 1,
	xpReward: 0,
	intentPool: [],
	immunities: ["poison"],
};
