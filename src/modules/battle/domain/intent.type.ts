import type { AnchorTarget, Card } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "./grid.type";

export type Intent = {
	cardId: Card["id"];
	figureId: BattleUnit["id"];
	target?: AnchorTarget;
	intendedMove?: GridPosition[];
	dangerZone?: GridPosition[];
	projectedMoves?: Record<BattleUnit["id"], GridPosition>;
	projectedCasualties?: BattleUnit["id"][];
};
