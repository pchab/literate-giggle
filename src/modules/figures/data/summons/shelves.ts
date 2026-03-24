import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const shelves: UnitBlueprint = {
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
