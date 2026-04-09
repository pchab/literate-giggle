import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const smugglerCrate: UnitBlueprint = {
	id: "smuggler_crate" as UnitBlueprint["id"],
	name: "Smuggler's Crate",
	spriteBase: "summons/crate",
	maxHp: 15,
	baseMove: 0,
	baseDef: 0,
	xpReward: 0,
	intentPool: [],
	onDeath: cardId("acid_flask_explosion"),
};
