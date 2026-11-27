import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { UnitBlueprint } from "../../domain/units.type";

export const stone_elemental: UnitBlueprint = {
	id: "stone_elemental" as UnitBlueprint["id"],
	name: "Stone Elemental",
	spriteBase: "monsters/stone_elemental",
	maxHp: 20,
	baseMove: 1,
	baseDef: 2,
	xpReward: 15,
	intentPool: [
		{
			cardId: cardId("fist_slam"),
			weight: 2,
		},
		{
			cardId: cardId("hurl_boulder"),
			weight: 1,
		},
	],
};

export const golem_overseer: UnitBlueprint = {
	id: "golem_overseer" as UnitBlueprint["id"],
	name: "Golem Overseer",
	hint: "Its stone shrugs off blows. Falling rocks and boulders ignore its armour and its guard: push it under the marked rocks, or into a boulder.",
	spriteBase: "monsters/golem_overseer",
	maxHp: 45,
	baseMove: 1,
	baseDef: 2,
	xpReward: 150,
	// Unused by the scripted fight; kept as a fallback for editors.
	intentPool: [{ cardId: cardId("seismic_slam"), weight: 1 }],
	phases: [
		{
			atHpPercent: 100,
			bark: "INTRUDERS. THE PASSAGE IS SEALED.",
			intentPattern: [
				cardId("ceiling_collapse"),
				cardId("seismic_slam"),
				cardId("hardened_stone"),
			],
		},
		{
			atHpPercent: 50,
			bark: "CORE OVERHEATING. ABANDONING DEFENCE.",
			intentPattern: [cardId("seismic_slam"), cardId("ceiling_collapse")],
		},
	],
};
