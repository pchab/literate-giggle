import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const shelves: UnitBlueprint = {
	id: "shelves" as UnitBlueprint["id"],
	name: "Shelves",
	spriteBase: "summons/shelves",
	maxHp: 5,
	baseMove: 0,
	baseDef: 1,
	xpReward: 0,
	intentPool: [],
	immunities: ["poison"],
	onDeath: cardId("spawn_vial"),
};
