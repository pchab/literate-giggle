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
