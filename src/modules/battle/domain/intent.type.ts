import type { Card } from "@/modules/cards/domain/cards.type";
import type { Figure, Monster } from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "./grid.type";

export type MonsterIntent = {
	monsterId: Monster["id"];
	targetId: Figure["id"] | null;
	intendedMove: GridPosition;
	dangerZone: GridPosition[];
	cardId: Card["id"];
};
