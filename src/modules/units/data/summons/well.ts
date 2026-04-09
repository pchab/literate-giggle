import type { UnitBlueprint } from "../../domain/units.type";

export const well: UnitBlueprint = {
	id: "well" as UnitBlueprint["id"],
	name: "Well",
	spriteBase: "summons/well",
	maxHp: 30,
	baseMove: 0,
	baseDef: 3,
	xpReward: 0,
	intentPool: [],
	immunities: ["poison"],
};
