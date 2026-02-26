import type { Card } from "@/modules/cards/domain/cards.type";

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

export interface ClassDefinition {
	id: HeroClass;
	name: string;
	spriteBase: string;

	// The permanent stat bumps granted upon entering this class
	bonusMaxHp: number;
	bonusBaseDef: number;
	bonusBaseMove: number;

	// The Utility Card choices unlocked when promoting to this class
	utilityCardChoices: Card["id"][];
}
