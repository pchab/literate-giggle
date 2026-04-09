import type { UnitBlueprint } from "../../domain/units.type";

export const iceWall: UnitBlueprint = {
	id: "ice_wall" as UnitBlueprint["id"],
	name: "Ice Wall",
	spriteBase: "summons/ice_wall",
	maxHp: 10,
	baseMove: 0,
	baseDef: 0,
	xpReward: 0,
	intentPool: [],
};
