import { QUEST_DWARVEN_HIGHWAY } from "@/modules/campaign/data/dwarven-passage/dwarvenPassage.quest";
import { NECROMANCER_QUEST_ID } from "@/modules/campaign/data/necromancer/necromancer.quest";
import { VERDANT_RECLAMATION } from "@/modules/campaign/data/verdant-reclamation/verdantReclamation.quest";
import { cardId } from "@/modules/cards/helpers/cards.helper";
import { PASSIVE_IDS } from "@/modules/units/data/passiveIds.data";
import type { ClassDefinition, HeroClass } from "../domain/heroClass.types";

export const CLASS_REGISTRY: Record<HeroClass, ClassDefinition> = {
	HOBO: {
		id: "HOBO",
		name: "Hobo",
		spriteBase: "heroes/hobo",
		utilityCardChoices: [cardId("bandage")],
		xpThresholds: [0, 5, 10, 15, 20, 25],
		levelUpTriggers: [
			[],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "cardChoice",
					options: [
						cardId("hamstring"),
						cardId("shield_block"),
						cardId("bear_trap"),
					],
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{ type: "powerRune" },
				{
					type: "classPromotion",
					classId: ["MAGE", "FIGHTER", "ROGUE", "ARCHER", "CLERIC"],
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
		xpThresholds: [10, 20, 30, 40, 50, 60],
		levelUpTriggers: [
			[
				{ type: "passiveUnlock", passiveId: PASSIVE_IDS.hold_the_line },
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{ type: "powerRune" },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club"),
					newCardId: cardId("short_sword"),
				},
				{ type: "unlockQuest", questId: QUEST_DWARVEN_HIGHWAY },
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "cardChoice",
					options: [
						cardId("shield_block"),
						cardId("bull_rush"),
						cardId("hamstring"),
					],
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "passiveChoice",
					options: [
						PASSIVE_IDS.opportunist,
						PASSIVE_IDS.momentum,
						PASSIVE_IDS.second_wind,
					],
				},
			],
			[{ type: "classPromotion", classId: ["KNIGHT", "BARBARIAN"] }],
		],
	},
	MAGE: {
		id: "MAGE",
		name: "Mage",
		spriteBase: "heroes/mage",
		utilityCardChoices: [cardId("arcane_shield"), cardId("summon_arcane_wisp")],
		xpThresholds: [10, 20, 30, 40, 50, 60],
		levelUpTriggers: [
			[
				{ type: "passiveUnlock", passiveId: PASSIVE_IDS.spell_focus },
				{ type: "statsIncrease", stat: "hp", amount: 1 },
				{ type: "powerRune" },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club"),
					newCardId: cardId("arcane_shot"),
				},
				{ type: "unlockQuest", questId: NECROMANCER_QUEST_ID },
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "cardChoice",
					options: [
						cardId("arcane_shield"),
						cardId("summon_arcane_wisp"),
						cardId("blinding_sigil"),
					],
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "passiveChoice",
					options: [
						PASSIVE_IDS.opportunist,
						PASSIVE_IDS.momentum,
						PASSIVE_IDS.second_wind,
					],
				},
			],
			[{ type: "classPromotion", classId: ["PYROMANCER", "CRYOMANCER"] }],
		],
	},
	ROGUE: {
		id: "ROGUE",
		name: "Rogue",
		spriteBase: "heroes/rogue",
		utilityCardChoices: [cardId("poison_shiv"), cardId("hamstring")],
		xpThresholds: [10, 20, 30, 40, 50, 60],
		levelUpTriggers: [
			[
				{ type: "passiveUnlock", passiveId: PASSIVE_IDS.backstab },
				{ type: "statsIncrease", stat: "hp", amount: 1 },
				{ type: "statsIncrease", stat: "move", amount: 1 },
				{ type: "powerRune" },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club"),
					newCardId: cardId("dagger"),
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "cardChoice",
					options: [
						cardId("poison_shiv"),
						cardId("hamstring"),
						cardId("bear_trap"),
					],
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "passiveChoice",
					options: [
						PASSIVE_IDS.opportunist,
						PASSIVE_IDS.momentum,
						PASSIVE_IDS.second_wind,
					],
				},
			],
			// [{ type: "classPromotion", classId: [] }],
		],
	},
	ARCHER: {
		id: "ARCHER",
		name: "Archer",
		spriteBase: "heroes/archer",
		utilityCardChoices: [cardId("bear_trap")],
		xpThresholds: [10, 20, 30, 40, 50, 60],
		levelUpTriggers: [
			[
				{ type: "passiveUnlock", passiveId: PASSIVE_IDS.steady_aim },
				{ type: "statsIncrease", stat: "hp", amount: 1 },
				{ type: "powerRune" },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club"),
					newCardId: cardId("short_bow"),
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "cardChoice",
					options: [
						cardId("bear_trap"),
						cardId("hamstring"),
						cardId("blinding_sigil"),
					],
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "passiveChoice",
					options: [
						PASSIVE_IDS.opportunist,
						PASSIVE_IDS.momentum,
						PASSIVE_IDS.second_wind,
					],
				},
			],
			// [{ type: "classPromotion", classId: [] }],
		],
	},
	CLERIC: {
		id: "CLERIC",
		name: "Cleric",
		spriteBase: "heroes/cleric",
		utilityCardChoices: [cardId("divine_aegis"), cardId("blinding_sigil")],
		xpThresholds: [10, 20, 30, 40, 50, 60],
		levelUpTriggers: [
			[
				{ type: "passiveUnlock", passiveId: PASSIVE_IDS.devotion },
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{ type: "powerRune" },
				{
					type: "cardUpgrade",
					oldCardId: cardId("club"),
					newCardId: cardId("iron_mace"),
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "cardChoice",
					options: [
						cardId("divine_aegis"),
						cardId("blinding_sigil"),
						cardId("sylvan_balm"),
					],
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "passiveChoice",
					options: [
						PASSIVE_IDS.opportunist,
						PASSIVE_IDS.momentum,
						PASSIVE_IDS.second_wind,
					],
				},
			],
		],
	},
	KNIGHT: {
		id: "KNIGHT",
		name: "Knight",
		spriteBase: "heroes/knight",
		utilityCardChoices: [cardId("challenge")],
		xpThresholds: [10, 20, 30, 40, 50, 60],
		levelUpTriggers: [
			[
				{ type: "passiveUnlock", passiveId: PASSIVE_IDS.bulwark },
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("short_sword"),
					newCardId: cardId("iron_sword"),
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "cardChoice",
					options: [
						cardId("challenge"),
						cardId("shield_block"),
						cardId("bull_rush"),
					],
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "passiveChoice",
					options: [
						PASSIVE_IDS.opportunist,
						PASSIVE_IDS.momentum,
						PASSIVE_IDS.second_wind,
					],
				},
			],
		],
	},
	BARBARIAN: {
		id: "BARBARIAN",
		name: "Barbarian",
		spriteBase: "heroes/barbarian",
		utilityCardChoices: [cardId("war_cry")],
		xpThresholds: [10, 20, 30, 40, 50, 60],
		levelUpTriggers: [
			[
				{ type: "passiveUnlock", passiveId: PASSIVE_IDS.bloodlust },
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{ type: "statsIncrease", stat: "def", amount: 1 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("short_sword"),
					newCardId: cardId("great_axe"),
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "cardChoice",
					options: [
						cardId("war_cry"),
						cardId("bull_rush"),
						cardId("hamstring"),
					],
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "passiveChoice",
					options: [
						PASSIVE_IDS.opportunist,
						PASSIVE_IDS.momentum,
						PASSIVE_IDS.second_wind,
					],
				},
			],
		],
	},
	PYROMANCER: {
		id: "PYROMANCER",
		name: "Pyromancer",
		spriteBase: "heroes/pyromancer",
		utilityCardChoices: [cardId("ignite")],
		xpThresholds: [10, 20, 30, 40, 50, 60],
		levelUpTriggers: [
			[
				{ type: "passiveUnlock", passiveId: PASSIVE_IDS.kindling },
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("arcane_shot"),
					newCardId: cardId("fireball"),
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "cardChoice",
					options: [
						cardId("ignite"),
						cardId("arcane_shield"),
						cardId("blinding_sigil"),
					],
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "passiveChoice",
					options: [
						PASSIVE_IDS.opportunist,
						PASSIVE_IDS.momentum,
						PASSIVE_IDS.second_wind,
					],
				},
			],
		],
	},
	CRYOMANCER: {
		id: "CRYOMANCER",
		name: "Cryomancer",
		spriteBase: "heroes/cryomancer",
		utilityCardChoices: [cardId("ice_wall"), cardId("frostbite")],
		xpThresholds: [10, 20, 30, 40, 50, 60],
		levelUpTriggers: [
			[
				{ type: "passiveUnlock", passiveId: PASSIVE_IDS.permafrost },
				{ type: "statsIncrease", stat: "hp", amount: 2 },
				{
					type: "cardUpgrade",
					oldCardId: cardId("arcane_shot"),
					newCardId: cardId("frost_shards"),
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "cardChoice",
					options: [
						cardId("ice_wall"),
						cardId("frostbite"),
						cardId("arcane_shield"),
					],
				},
			],
			[{ type: "statsIncrease", amount: 1, stat: "hp" }, { type: "powerRune" }],
			[
				{ type: "statsIncrease", amount: 1, stat: "hp" },
				{
					type: "passiveChoice",
					options: [
						PASSIVE_IDS.opportunist,
						PASSIVE_IDS.momentum,
						PASSIVE_IDS.second_wind,
					],
				},
			],
		],
	},
};
