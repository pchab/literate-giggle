import type { UnitBlueprint } from "../../domain/units.type";

/** Dropped by the Golem Overseer's falling ceiling. Jagged: collisions hurt. */
export const boulder: UnitBlueprint = {
	id: "boulder" as UnitBlueprint["id"],
	name: "Boulder",
	hint: "Jagged rock. Anything pushed into it, or it pushed into, takes triple collision damage that ignores armour and block.",
	spriteBase: "summons/boulder",
	maxHp: 8,
	baseMove: 0,
	baseDef: 0,
	xpReward: 0,
	intentPool: [],
	collisionMultiplier: 3,
};
