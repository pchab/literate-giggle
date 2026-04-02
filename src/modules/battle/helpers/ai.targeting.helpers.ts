import type { AnchorTarget, Card } from "@/modules/cards/domain/cards.type";
import type {
	AIBattleUnit,
	BattleUnit,
} from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "../domain/grid.type";
import type { StoreGet } from "../store/battle.store";
import { isUnitInTile } from "./grid.helpers";
import { getLineOfSightPath } from "./move.helpers";

export type TargetResolver = (get: StoreGet) => <C extends AIBattleUnit>(
	aiFigure: C,
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

export function getAnchorTarget<C extends BattleUnit>({
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
		figures: obstacles,
	});

	if (actualTarget) {
		return {
			gridPosition: actualTarget.gridPosition,
			size: actualTarget.size ?? { cols: 1, rows: 1 },
		};
	}

	return intendedTarget;
}

function getActualTarget<C extends BattleUnit, T extends BattleUnit>({
	attacker,
	intendedTargetPos,
	figures,
}: {
	attacker: C;
	intendedTargetPos: GridPosition;
	figures: T[];
}) {
	const flightPath = getLineOfSightPath(
		attacker.gridPosition,
		intendedTargetPos,
	);

	for (let i = 1; i < flightPath.length; i++) {
		const tile = flightPath[i];
		const figureHit = figures.find(
			(f) => f.currentHp > 0 && isUnitInTile(tile)(f) && f.id !== attacker.id,
		);
		if (figureHit) return figureHit;
	}
	return null;
}
