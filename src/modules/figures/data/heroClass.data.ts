import {
	QUEST_DWARVEN_HIGHWAY,
	QUEST_MAGE_AWAKENING,
} from "@/modules/campaign/data/quests.data";
import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { ClassDefinition, HeroClass } from "../domain/heroClass.types";

export const CLASS_REGISTRY: Record<HeroClass, ClassDefinition> = {
	HOBO: {
		id: "HOBO",
		name: "Hobo",
		spriteBase: "heroes/hobo",
		utilityCardChoices: [cardId("bandage-1")],
		xpThresholds: [0, 1, 1, 1, 1, 1],
		levelUpTriggers: [
			[],
			[
				{
					type: "cardUpgrade",
					oldCardId: cardId("club-1"),
					newCardId: cardId("club-2"),
				},
			],
			[{ type: "statsIncrease", amount: 2, stat: "hp" }],
			[
				{
					type: "cardUpgrade",
					oldCardId: cardId("club-2"),
					newCardId: cardId("club-3"),
				},
			],
			[
				{
					type: "cardUpgrade",
					oldCardId: cardId("bandage-1"),
					newCardId: cardId("bandage-2"),
				},
			],
			[
				{
					type: "classPromotion",
					classId: ["MAGE", "FIGHTER", "ROGUE", "ARCHER"],
				},
			],
		],
	},
	FIGHTER: {
		id: "FIGHTER",
		name: "Fighter",
		spriteBase: "heroes/fighter",
		utilityCardChoices: [cardId("shield-block-1"), cardId("battle-cry-1")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club-3"),
					newCardId: cardId("short-sword-1"),
				},
				{ type: "unlockQuest", questId: QUEST_DWARVEN_HIGHWAY },
			],
			[
				{
					type: "cardUpgrade",
					oldCardId: cardId("short-sword-1"),
					newCardId: cardId("short-sword-2"),
				},
			],
			[{ type: "passiveUnlock", passiveId: "passive-toughness" }],
			[
				{
					type: "cardUpgrade",
					oldCardId: cardId("short-sword-2"),
					newCardId: cardId("short-sword-3"),
				},
			],
			[{ type: "classPromotion", classId: ["KNIGHT", "BARBARIAN"] }],
		],
	},
	MAGE: {
		id: "MAGE",
		name: "Mage",
		spriteBase: "heroes/mage",
		utilityCardChoices: [cardId("arcane-shield-1"), cardId("push-1")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club-3"),
					newCardId: cardId("apprentice-staff-1"),
				},
				{ type: "unlockQuest", questId: QUEST_MAGE_AWAKENING },
			],
			[
				{
					type: "cardUpgrade",
					oldCardId: cardId("apprentice-staff-1"),
					newCardId: cardId("apprentice-staff-2"),
				},
			],
			[{ type: "passiveUnlock", passiveId: "passive-toughness" }],
			[
				{
					type: "cardUpgrade",
					oldCardId: cardId("apprentice-staff-2"),
					newCardId: cardId("apprentice-staff-3"),
				},
			],
			[{ type: "classPromotion", classId: ["PYROMANCER", "CRYOMANCER"] }],
		],
	},
	ROGUE: {
		id: "ROGUE",
		name: "Rogue",
		spriteBase: "heroes/rogue",
		utilityCardChoices: [],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [[]],
	},
	ARCHER: {
		id: "ARCHER",
		name: "Archer",
		spriteBase: "heroes/archer",
		utilityCardChoices: [],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [[]],
	},
	KNIGHT: {
		id: "KNIGHT",
		name: "Knight",
		spriteBase: "heroes/knight",
		utilityCardChoices: [cardId("knight-placeholder-1")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("short-sword-3"),
					newCardId: cardId("knight-weapon-1"),
				},
			],
		],
	},
	BARBARIAN: {
		id: "BARBARIAN",
		name: "Barbarian",
		spriteBase: "heroes/barbarian",
		utilityCardChoices: [cardId("barbarian-placeholder-1")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [[]],
	},
	PYROMANCER: {
		id: "PYROMANCER",
		name: "Pyromancer",
		spriteBase: "heroes/pyromancer",
		utilityCardChoices: [cardId("pyromancer-placeholder-1")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("apprentice-staff-3"),
					newCardId: cardId("pyromancer-weapon-1"),
				},
			],
		],
	},
	CRYOMANCER: {
		id: "CRYOMANCER",
		name: " Cryomancer",
		spriteBase: "heroes/cryomancer",
		utilityCardChoices: [
			cardId("ice-wall-1"),
			cardId("cryomancer-placeholder-1"),
		],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("apprentice-staff-3"),
					newCardId: cardId("cryomancer-weapon-1"),
				},
			],
		],
	},
	CLERIC: {
		id: "CLERIC",
		name: "Cleric",
		spriteBase: "heroes/cleric",
		utilityCardChoices: [],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [[]],
	},
};
