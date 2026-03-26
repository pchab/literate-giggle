import type {
	AITargetPreference,
	Card,
} from "@/modules/cards/domain/cards.type";
import { isSummon } from "@/modules/figures/helpers/figures.helpers";
import type {
	AIBattleUnit,
	BattleUnit,
} from "../../figures/domain/figures.type";
import type { GridPosition } from "../domain/grid.type";
import type { TargetResolver } from "./ai.actions.helpers";
import { areEnemies } from "./effects/effect.helpers";
import {
	calculateAttackableCells,
	calculateReachableCells,
	canUnitFit,
	getDistanceToBoundingBox,
	getLineOfSightPath,
	isTileEmpty,
	isTileInBounds,
	isUnitInTile,
} from "./grid.helpers";
import { calculateExactPath } from "./move.helpers";

function isGridPosition(
	targetPref: AITargetPreference,
): targetPref is GridPosition {
	return typeof targetPref !== "string";
}

const calculateAIMove = <C extends AIBattleUnit, T extends BattleUnit>(
	monster: C,
	targetFigure: T,
	card: Card,
	figures: T[],
): GridPosition | null => {
	if (monster.baseMove === 0) {
		return monster.gridPosition;
	}

	const canTargetSelf = ["requires_entity", "requires_ally"].includes(
		card.playRequirement,
	);
	const minRange = canTargetSelf ? 0 : 1;
	const hardObstacles = figures.filter(areEnemies(monster));

	// ==========================================
	// 1. COWARD / KITING LOGIC ("away")
	// ==========================================
	if (card.aiTargetPreference === "away") {
		const reachable = calculateReachableCells({
			movingUnit: monster,
			blockingFigures: hardObstacles,
			canTargetSelf: true,
		});

		const validStops = reachable.filter((cell) =>
			canUnitFit({ unit: { ...monster, gridPosition: cell }, figures }),
		);

		const firingSpots = validStops.filter((cell) => {
			if (card.playRequirement === "requires_empty_cell") {
				const possibleSpawns = calculateAttackableCells({
					attacker: { ...monster, gridPosition: cell },
					rangeValue: card.range,
					canTargetSelf: false,
				})
					.filter(isTileInBounds)
					.filter(isTileEmpty(figures));

				return possibleSpawns.length > 0;
			}

			return isTargetInRange({
				card,
				minRange,
				attacker: { ...monster, gridPosition: cell },
				target: targetFigure,
			});
		});

		if (firingSpots.length > 0) {
			firingSpots.sort((a, b) => {
				const distA = getDistanceToBoundingBox({
					caster: { ...monster, gridPosition: a },
					target: targetFigure,
				});
				const distB = getDistanceToBoundingBox({
					caster: { ...monster, gridPosition: b },
					target: targetFigure,
				});
				return distB - distA;
			});

			return firingSpots[0];
		}
	}

	// ==========================================
	// 2. STANDARD / AGGRESSIVE LOGIC
	// ==========================================
	const distance = getDistanceToBoundingBox({
		caster: monster,
		target: targetFigure,
	});

	if (distance >= minRange && distance <= card.range) {
		return monster.gridPosition;
	}

	const fullPath = calculateExactPath({
		movingUnit: monster,
		targetPos: targetFigure.gridPosition,
		figures: hardObstacles,
		minRange,
		maxRange: card.range,
	});

	if (fullPath.length === 0) return null;

	let stepsToTake = Math.min(monster.baseMove, fullPath.length);

	while (stepsToTake > 0) {
		const candidateDest = fullPath[stepsToTake - 1];

		if (
			canUnitFit({ unit: { ...monster, gridPosition: candidateDest }, figures })
		) {
			return candidateDest;
		}
		stepsToTake--;
	}

	return monster.gridPosition;
};

export const getIdealTarget: TargetResolver = <C extends AIBattleUnit>(
	aiFigure: C,
	card: Card,
	figures: BattleUnit[],
) => {
	if (
		card.aiTargetPreference === "self"
	) {
		return {
			reachableTarget: aiFigure,
			moveDest: aiFigure.gridPosition,
			canHit: true,
		};
	}

	if (card.aiTargetPreference && isGridPosition(card.aiTargetPreference)) {
		const target = figures.find(isUnitInTile(card.aiTargetPreference));
		if (target) {
			const moveDest = calculateAIMove(aiFigure, target, card, figures);
			return {
				reachableTarget: target,
				moveDest,
				canHit: Boolean(
					moveDest &&
					isTargetInRange({
						card,
						minRange: 1,
						attacker: {
							...aiFigure,
							gridPosition: moveDest,
						},
						target,
					}),
				),
			};
		}
	}

	const targetsAllies = card.playRequirement === "requires_ally";
	const targetsAny = card.playRequirement === "requires_entity";
	const aliveOthers = figures.filter((f) => f.currentHp > 0);

	const validTargetsToEvaluate = aliveOthers.filter((f) => {
		if (targetsAny) return true;
		if (isSummon(f) && f.allegiance === "NEUTRAL") return false;
		return targetsAllies ? !areEnemies(aiFigure)(f) : areEnemies(aiFigure)(f);
	});

	const orderedTargets = getOrderedTargets<C, BattleUnit>(
		aiFigure,
		card,
		validTargetsToEvaluate,
	);

	let fallbackMove: {
		reachableTarget: BattleUnit;
		moveDest: GridPosition;
		canHit: boolean;
	} | null = null;

	for (const target of orderedTargets) {
		const moveDest = calculateAIMove(aiFigure, target, card, figures);

		if (moveDest) {
			const minRange = targetsAllies || targetsAny ? 0 : 1;
			const canHit = isTargetInRange({
				card,
				minRange,
				attacker: {
					...aiFigure,
					gridPosition: moveDest,
				},
				target,
			});

			if (canHit) {
				return { reachableTarget: target, moveDest, canHit: true };
			}

			if (!fallbackMove) {
				fallbackMove = { reachableTarget: target, moveDest, canHit: false };
			}
		}
	}

	return (
		fallbackMove ?? {
			reachableTarget: null,
			moveDest: null,
			canHit: false,
		}
	);
};

export function getOrderedTargets<C extends AIBattleUnit, T extends BattleUnit>(
	aiFigure: C,
	card: Card,
	targets: T[],
): T[] {
	const sortFunction = (figureA: T, figureB: T) => {
		switch (card.aiTargetPreference) {
			case "lowestDef":
				return figureA.baseDef - figureB.baseDef;
			case "lowestHp":
				return figureA.currentHp - figureB.currentHp;
			case "random":
				return Math.random() - 0.5;
			default:
				return (
					getDistanceToBoundingBox({
						caster: aiFigure,
						target: figureA,
					}) -
					getDistanceToBoundingBox({
						caster: aiFigure,
						target: figureB,
					})
				);
		}
	};
	return [...targets]
		.filter(({ currentHp }) => currentHp > 0)
		.sort(sortFunction);
}

export function isTargetInRange<C extends BattleUnit, T extends BattleUnit>({
	card,
	minRange,
	attacker,
	target,
}: {
	card: Card;
	minRange: number;
	attacker: C;
	target: T;
}) {
	const distance = getDistanceToBoundingBox({ caster: attacker, target });
	return distance >= minRange && distance <= card.range;
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
