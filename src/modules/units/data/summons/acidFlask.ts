import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const acidFlask: UnitBlueprint = {
	id: "acid_flask" as UnitBlueprint["id"],
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
