import type { AnchorTarget, Card } from "@/modules/cards/domain/cards.type";
import type {
	AIBattleUnit,
	BattleUnit,
} from "@/modules/figures/domain/figures.type";
import type { BoundingBox, GridPosition } from "../domain/grid.type";
import {
	calculateAttackableCells,
	getLineOfSightPath,
	isTileEmpty,
	isTileInBounds,
	isUnitInTile,
} from "./grid.helpers";

export type TargetResolver = <C extends AIBattleUnit>(
	aiFigure: C,
	card: Card,
	figures: BattleUnit[],
) => {
	reachableTarget: BoundingBox | null;
	moveDest: GridPosition | null;
	canHit: boolean;
};

export type AnchorResolver = ({
	attacker: { gridPosition },
	card,
	reachableTarget,
	obstacles,
}: {
	attacker: AIBattleUnit;
	card: Card;
	reachableTarget: BoundingBox;
	obstacles: BattleUnit[];
}) => AnchorTarget;

export function getAnchorTarget<C extends BattleUnit, T extends BoundingBox>({
	attacker,
	card,
	reachableTarget,
	obstacles,
}: {
	attacker: C;
	card: Card;
	reachableTarget: T;
	obstacles: BattleUnit[];
}): AnchorTarget {
	const { gridPosition, size } = attacker;
	if (card.playRequirement === "no_target") {
		return { gridPosition, size };
	}

	if (card.playRequirement === "requires_empty_cell") {
		const possibleSpawns = calculateAttackableCells({
			attacker,
			rangeValue: card.range,
			canTargetSelf: false,
		})
			.filter(isTileInBounds)
			.filter(isTileEmpty(obstacles));

		if (possibleSpawns.length === 0) return null;
		const chosenSpawn =
			possibleSpawns[Math.floor(Math.random() * possibleSpawns.length)];
		return { gridPosition: chosenSpawn, size: { cols: 1, rows: 1 } };
	}

	const actualTarget =
		getActualTarget({
			attacker,
			intendedTargetPos: reachableTarget.gridPosition,
			figures: obstacles,
		}) ?? reachableTarget;

	return {
		gridPosition: actualTarget.gridPosition,
		size: actualTarget.size ?? { cols: 1, rows: 1 },
	};
}

export function getActualTarget<C extends BattleUnit, T extends BattleUnit>({
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
