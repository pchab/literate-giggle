import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const crazedAlchemist: UnitBlueprint = {
	id: "crazed_alchemist" as UnitBlueprint["id"],
	name: "Alchemist Barnaby",
	hint: "Armour 6 shrugs off most hits. Poison ignores armour, and Vulnerable adds damage before it: break his shelves to spill acid. He only charges in straight lines and diagonals.",
	spriteBase: "monsters/merchant",
	maxHp: 40,
	baseMove: 2,
	baseDef: 6,
	xpReward: 50,
	intentPool: [
		{
			cardId: cardId("alchemical_frenzy"),
			weight: 1,
		},
	],
};
