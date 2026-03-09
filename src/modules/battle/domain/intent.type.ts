import type { Card } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "./grid.type";

export type AIIntent = {
	figureId: BattleUnit["id"];
	targetId: BattleUnit["id"] | null;
	intendedMove: GridPosition;
	dangerZone: GridPosition[];
	cardId: Card["id"];
};
