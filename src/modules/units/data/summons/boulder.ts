import type { UnitBlueprint } from "../../domain/units.type";
import { rubble_elemental } from "../monsters/golem.data";

/** Dropped by the Golem Overseer's falling ceiling. Jagged: collisions hurt. */
export const boulder: UnitBlueprint = {
	id: "boulder" as UnitBlueprint["id"],
	name: "Boulder",
	hint: "Jagged rock. Anything pushed into it, or it pushed into, takes triple collision damage that ignores armour and block. Wakes up as a Rubble Elemental after 2 rounds, with whatever share of its HP is left: break it first.",
	spriteBase: "summons/boulder",
	maxHp: 8,
	baseMove: 0,
	baseDef: 0,
	xpReward: 0,
	intentPool: [],
	collisionMultiplier: 3,
	transformsInto: { blueprint: rubble_elemental, afterRounds: 2 },
};
