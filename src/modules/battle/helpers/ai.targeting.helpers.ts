import type { AnchorTarget, Card } from "@/modules/cards/domain/cards.type";
import type {
	AIBattleUnit,
	BattleUnit,
} from "@/modules/units/domain/units.type";
import type { GridEntity, GridPosition } from "../domain/grid.type";
import type { BattleGet } from "../store/battle.store";
import { isUnitInTile } from "./grid.helpers";
import { getLineOfSightPath } from "./move.helpers";

export type TargetResolver = (get: BattleGet) => <C extends AIBattleUnit>(
	aiUnit: C,
	card: Card,
) => {
	intendedTarget: AnchorTarget | null;
	moveDest: GridPosition | null;
	canHit: boolean;
};

export type AnchorResolver = ({
	attacker,
	card,
	intendedTarget,
	obstacles,
}: {
	attacker: AIBattleUnit;
	card: Card;
	intendedTarget: AnchorTarget;
	obstacles: BattleUnit[];
}) => AnchorTarget;

export function getAnchorTarget<C extends GridEntity>({
	attacker,
	card,
	intendedTarget,
	obstacles,
}: {
	attacker: C;
	card: Card;
	intendedTarget: AnchorTarget;
	obstacles: BattleUnit[];
}): AnchorTarget {
	const { gridPosition, size } = attacker;

	if (!intendedTarget || card.playRequirement === "no_target") {
		return { gridPosition, size };
	}

	if (card.playRequirement === "requires_empty_cell") {
		return intendedTarget;
	}

	const actualTarget = getActualTarget({
		attacker,
		intendedTargetPos: intendedTarget.gridPosition,
		units: obstacles,
	});

	if (actualTarget) {
		return {
			gridPosition: actualTarget.gridPosition,
			size: actualTarget.size ?? { cols: 1, rows: 1 },
		};
	}

	return intendedTarget;
}

function getActualTarget<C extends GridEntity, T extends BattleUnit>({
	attacker,
	intendedTargetPos,
	units,
}: {
	attacker: C;
	intendedTargetPos: GridPosition;
	units: T[];
}) {
	const flightPath = getLineOfSightPath(
		attacker.gridPosition,
		intendedTargetPos,
	);

	for (let i = 1; i < flightPath.length; i++) {
		const tile = flightPath[i];
		const unitHit = units.find(
			(u) => u.currentHp > 0 && isUnitInTile(tile)(u) && u.id !== attacker.id,
		);
		if (unitHit) return unitHit;
	}
	return null;
}
