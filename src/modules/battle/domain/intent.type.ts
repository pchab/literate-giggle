import type { Card } from "@/modules/cards/domain/cards.type";
import type { Figure } from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "./grid.type";

export type AIIntent = {
	figureId: Figure["id"];
	targetId: Figure["id"] | null;
	intendedMove: GridPosition;
	dangerZone: GridPosition[];
	cardId: Card["id"];
};
