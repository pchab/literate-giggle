import type { AnchorTarget, Card } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import type { GridPosition } from "./grid.type";

export type ShadowStateDiff = {
	projectedMoves: Record<BattleUnit["id"], GridPosition>;
	projectedCasualties: BattleUnit["id"][];
	projectedDamage: Record<BattleUnit["id"], number>;
	projectedHealing: Record<BattleUnit["id"], number>;
	projectedSpawns: BattleUnit[];
};

export type Intent = {
	cardId: Card["id"];
	unitId: BattleUnit["id"];
	target?: AnchorTarget;
	intendedMove?: GridPosition[];
	dangerZone?: GridPosition[];
};
