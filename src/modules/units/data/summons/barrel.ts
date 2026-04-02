import type { UnitBlueprint } from "../../domain/units.type";

export const barrel: UnitBlueprint = {
	name: "Barrel",
	spriteBase: "summons/barrel",
	maxHp: 10,
	baseMove: 0,
	baseDef: 1,
	xpReward: 0,
	intentPool: [],
	immunities: ["poison"],
};
