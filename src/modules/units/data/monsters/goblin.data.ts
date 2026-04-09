import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const goblin: UnitBlueprint = {
	id: "goblin" as UnitBlueprint["id"],
	name: "Goblin",
	spriteBase: "monsters/goblin",
	maxHp: 10,
	baseMove: 2,
	baseDef: 0,
	xpReward: 6,
	intentPool: [
		{
			cardId: cardId("monster_melee_attack"),
			weight: 2,
		},
		{
			cardId: cardId("bandage"),
			weight: 1,
		},
	],
};

export const goblinShaman: UnitBlueprint = {
	id: "goblin_shaman" as UnitBlueprint["id"],
	name: "Goblin Shaman",
	spriteBase: "monsters/goblin_shaman",
	maxHp: 24,
	baseMove: 2,
	baseDef: 0,
	xpReward: 18,
	intentPool: [
		{
			cardId: cardId("volatile_transmutation"),
			weight: 1,
		},
	],
};
