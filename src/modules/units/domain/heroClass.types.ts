import type { Quest } from "@/modules/campaign/domain/quests.type";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/units/domain/units.type";
import type { StatusType } from "./status.type";

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

export type RuneDraftOption =
	| { type: "bonusDamage"; amount: number; label: string }
	| { type: "bonusHeal"; amount: number; label: string }
	| { type: "bonusRange"; amount: number; label: string }
	| { type: "bonusPushDistance"; amount: number; label: string }
	| { type: "bonusPushCollision"; amount: number; label: string }
	| {
			type: "bonusStatusAmount";
			statusType: StatusType;
			amount: number;
			label: string;
	  }
	| {
			type: "bonusStatusDuration";
			statusType: StatusType;
			amount: number;
			label: string;
	  };

export type LevelUpDefinition =
	| { type: "cardUpgrade"; oldCardId: Card["id"]; newCardId: Card["id"] }
	| { type: "cardUnlock"; newCards: Card["id"][] }
	| { type: "statsIncrease"; amount: number; stat: "hp" | "def" | "move" }
	| { type: "classPromotion"; classId: HeroClass[] }
	| { type: "passiveUnlock"; passiveId: string }
	/** Player picks one card to learn (resolved on the reward screen). */
	| { type: "cardChoice"; options: Card["id"][] }
	/** Player picks one passive (resolved on the reward screen). */
	| { type: "passiveChoice"; options: string[] }
	| { type: "unlockQuest"; questId: Quest["id"] }
	| { type: "powerRune" };

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
	classChoices: HeroClass[];
};

export type PendingPowerRune = {
	heroId: Hero["id"];
	choices: RuneDraftOption[];
};

/** One decision the player makes on the reward screen. */
export type LevelUpDraftStep =
	| { kind: "rune"; level: number; choices: RuneDraftOption[] }
	| { kind: "card"; level: number; options: Card["id"][] }
	| { kind: "passive"; level: number; options: string[] };

/** Everything a hero picked on the reward screen. */
export type HeroDraftResult = {
	runes: { rune: RuneDraftOption; cardInstanceId: Card["id"] }[];
	cards: Card["id"][];
	passives: string[];
};

export const EMPTY_DRAFT_RESULT: HeroDraftResult = {
	runes: [],
	cards: [],
	passives: [],
};
