import type { Quest } from "@/modules/campaign/domain/quests.type";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";

export type HeroClass =
	| "HOBO"
	| "FIGHTER"
	| "ROGUE"
	| "MAGE"
	| "CLERIC"
	| "ARCHER"
	| "KNIGHT"
	| "BARBARIAN"
	| "PYROMANCER"
	| "CRYOMANCER";

export type LevelUpDefinition =
	| { type: "cardUpgrade"; oldCardId: Card["id"]; newCardId: Card["id"] }
	| { type: "cardUnlock"; newCards: Card["id"][] }
	| { type: "statsIncrease"; amount: number; stat: "hp" | "def" | "move" }
	| { type: "classPromotion"; classId: HeroClass[] }
	| { type: "passiveUnlock"; passiveId: string }
	| { type: "unlockQuest"; questId: Quest["id"] };

export type ClassDefinition = {
	id: HeroClass;
	name: string;
	spriteBase: string;

	xpThresholds: number[];
	utilityCardChoices: Card["id"][];

	levelUpTriggers: LevelUpDefinition[][];
};

export type PendingPromotion = {
	heroId: Hero["id"];
	classChoices: HeroClass[]; // Holds ["MAGE", "FIGHTER"] or just ["KNIGHT"]
};
