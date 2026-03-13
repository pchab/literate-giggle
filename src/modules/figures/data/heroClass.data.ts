import { QUEST_DWARVEN_HIGHWAY } from "@/modules/campaign/data/dwarven-passage/dwarvenPassage.quest";
import { NECROMANCER_QUEST_ID } from "@/modules/campaign/data/necromancer/necromancer.quest";
import { VERDANT_RECLAMATION } from "@/modules/campaign/data/verdant-reclamation/verdantReclamation.quest";
import { cardId } from "@/modules/cards/helpers/cards.helper";
import type { ClassDefinition, HeroClass } from "../domain/heroClass.types";

export const CLASS_REGISTRY: Record<HeroClass, ClassDefinition> = {
	HOBO: {
		id: "HOBO",
		name: "Hobo",
		spriteBase: "heroes/hobo",
		utilityCardChoices: [cardId("bandage")],
		xpThresholds: [0, 5, 10, 15, 20, 25],
		levelUpTriggers: [
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "classPromotion",
					classId: ["MAGE", "FIGHTER", "ROGUE", "ARCHER"],
				},
				{
					type: "unlockQuest",
					questId: VERDANT_RECLAMATION.id,
				},
			],
		],
	},
	FIGHTER: {
		id: "FIGHTER",
		name: "Fighter",
		spriteBase: "heroes/fighter",
		utilityCardChoices: [cardId("shield_block"), cardId("bull_rush")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club"),
					newCardId: cardId("short_sword"),
				},
				{ type: "unlockQuest", questId: QUEST_DWARVEN_HIGHWAY },
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[{ type: "classPromotion", classId: ["KNIGHT", "BARBARIAN"] }],
		],
	},
	MAGE: {
		id: "MAGE",
		name: "Mage",
		spriteBase: "heroes/mage",
		utilityCardChoices: [cardId("arcane_shield"), cardId("summon_arcane_wisp")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club"),
					newCardId: cardId("arcane_shot"),
				},
				{ type: "unlockQuest", questId: NECROMANCER_QUEST_ID },
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[{ type: "classPromotion", classId: ["PYROMANCER", "CRYOMANCER"] }],
		],
	},
	ROGUE: {
		id: "ROGUE",
		name: "Rogue",
		spriteBase: "heroes/rogue",
		utilityCardChoices: [cardId("poison_shiv"), cardId("hamstring")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "move", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club"),
					newCardId: cardId("dagger"),
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			// [{ type: "classPromotion", classId: [] }],
		],
	},
	ARCHER: {
		id: "ARCHER",
		name: "Archer",
		spriteBase: "heroes/archer",
		utilityCardChoices: [cardId("bear_trap")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club"),
					newCardId: cardId("short_bow"),
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			// [{ type: "classPromotion", classId: [] }],
		],
	},
	KNIGHT: {
		id: "KNIGHT",
		name: "Knight",
		spriteBase: "heroes/knight",
		utilityCardChoices: [cardId("knight_placeholder")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("short_sword"),
					newCardId: cardId("iron_sword"),
				},
			],
		],
	},
	BARBARIAN: {
		id: "BARBARIAN",
		name: "Barbarian",
		spriteBase: "heroes/barbarian",
		utilityCardChoices: [cardId("barbarian_placeholder")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("short_sword"),
					newCardId: cardId("great_axe"),
				},
			],
		],
	},
	PYROMANCER: {
		id: "PYROMANCER",
		name: "Pyromancer",
		spriteBase: "heroes/pyromancer",
		utilityCardChoices: [cardId("pyromancer_placeholder")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("arcane_shot"),
					newCardId: cardId("fireball"),
				},
			],
		],
	},
	CRYOMANCER: {
		id: "CRYOMANCER",
		name: " Cryomancer",
		spriteBase: "heroes/cryomancer",
		utilityCardChoices: [cardId("ice_wall"), cardId("cryomancer_placeholder")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("arcane_shot"),
					newCardId: cardId("frost_shards"),
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
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club"),
					newCardId: cardId("iron_mace"),
				},
			],
		],
	},
};
