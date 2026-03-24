import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/figures.type";

export const acidFlask: UnitBlueprint = {
	name: "Acid Flask",
	spriteBase: "summons/acid_flask",
	maxHp: 1,
	baseMove: 0,
	baseDef: 0,
	xpReward: 0,
	intentPool: [],
	immunities: ["poison"],
	onDeath: cardId("acid_flask_explosion"),
};
