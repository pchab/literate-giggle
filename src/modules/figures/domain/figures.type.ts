import type { Card } from "../../cards/domain/cards.type";
import type { GridPosition } from "../../grid/grid.type";
import type { Attack } from "../attacks";

type Figure = {
	id: number;
	currentHp: number;
	maxHp: number;
	gridPosition: GridPosition;
};

export type HeroClass = "Squire" | "Knight" | "Thief" | "Mage";
export type Hero = Figure & {
	heroClass: HeroClass;
	physAtk: number;
	physDef: number;
	currentPhysBlock: number;
	magAtk: number;
	magDef: number;
	currentMagBlock: number;
	deck: Card[];
	cards: [Card, Card];
};

export type EnemyType = "Boss" | "Skeleton" | "Bat" | "Archer";
export type Monster = Figure & {
	enemyType: EnemyType;
	attacks: Attack[];
	intent: Attack;
};
