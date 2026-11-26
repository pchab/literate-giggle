import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const giantToad: UnitBlueprint = {
	id: "giant_toad" as UnitBlueprint["id"],
	name: "Giant Toad",
	hint: "Its tongue drags a hero in and swallows them. Deal 12 damage to the toad to make it spit them out.",
	spriteBase: "monsters/giant_toad",
	maxHp: 60,
	baseMove: 2,
	baseDef: 0,
	xpReward: 60,
	size: { cols: 2, rows: 2 },
	immunities: ["vulnerable"],
	intentPool: [
		{ cardId: cardId("giant_chomp"), weight: 4 },
		{ cardId: cardId("tongue_lash"), weight: 3 },
		{ cardId: cardId("belly_flop"), weight: 3 },
	],
};
