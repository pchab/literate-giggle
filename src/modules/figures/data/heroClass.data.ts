import { QUEST_DWARVEN_HIGHWAY } from "@/modules/campaign/data/dwarven-passage/dwarvenPassage.quest";
import { NECROMANCER_QUEST_ID } from "@/modules/campaign/data/necromancer/necromancer.quest";
import { VERDANT_RECLAMATION } from "@/modules/campaign/data/verdant-reclamation/verdantReclamation.quest";
import { cardId } from "@/modules/cards/helpers/cards.helper";
import type {
	ClassDefinition,
	HeroClass,
	RuneDraftOption,
} from "../domain/heroClass.types";

const basicRuneChoice: RuneDraftOption[] = [
	{ type: "bonusDamage", amount: 2, label: "Increase damage" },
	{ type: "bonusHeal", amount: 1, label: "Increase heal" },
	{ type: "bonusRange", amount: 1, label: "Increase range" },
];

export const CLASS_REGISTRY: Record<HeroClass, ClassDefinition> = {
	HOBO: {
		id: "HOBO",
		name: "Hobo",
		spriteBase: "heroes/hobo",
		utilityCardChoices: [cardId("bandage-1")],
		xpThresholds: [0, 1, 2, 3, 4, 5],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "powerRune",
					choices: basicRuneChoice,
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "powerRune",
					choices: basicRuneChoice,
				},
			],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "powerRune",
					choices: basicRuneChoice,
				},
			],
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
		utilityCardChoices: [cardId("shield-block"), cardId("battle-cry")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club"),
					newCardId: cardId("short-sword"),
				},
				{ type: "unlockQuest", questId: QUEST_DWARVEN_HIGHWAY },
			],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "powerRune",
					choices: basicRuneChoice,
				},
			],
			[{ type: "passiveUnlock", passiveId: "passive-toughness" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "powerRune",
					choices: basicRuneChoice,
				},
			],
			[{ type: "classPromotion", classId: ["KNIGHT", "BARBARIAN"] }],
		],
	},
	MAGE: {
		id: "MAGE",
		name: "Mage",
		spriteBase: "heroes/mage",
		utilityCardChoices: [cardId("arcane-shield"), cardId("summon-arcane-wisp")],
		xpThresholds: [10, 20, 30, 40, 50],
		levelUpTriggers: [
			[
				{ type: "statsIncrease", stat: "hp", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club"),
					newCardId: cardId("apprentice-staff"),
				},
				{ type: "unlockQuest", questId: NECROMANCER_QUEST_ID },
			],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "powerRune",
					choices: basicRuneChoice,
				},
			],
			[{ type: "passiveUnlock", passiveId: "passive-toughness" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "powerRune",
					choices: basicRuneChoice,
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
					oldCardId: cardId("short-sword"),
					newCardId: cardId("knight-weapon"),
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
					oldCardId: cardId("apprentice-staff"),
					newCardId: cardId("pyromancer-weapon"),
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
					oldCardId: cardId("apprentice-staff"),
					newCardId: cardId("cryomancer-weapon"),
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
