import type { Card } from "@/modules/cards/domain/cards.type";
import { isSummon } from "@/modules/figures/helpers/figures.helpers";
import type {
	AIBattleUnit,
	BattleUnit,
} from "../../figures/domain/figures.type";
import type { GridPosition } from "../domain/grid.type";
import type { TargetResolver } from "./ai.targeting.helpers";
import { areEnemies } from "./effects/effect.helpers";
import {
	calculateAttackableCells,
	calculateReachableCells,
	canUnitFit,
	getDistanceToBoundingBox,
	isTileEmpty,
	isTileInBounds,
	isUnitInTile,
} from "./grid.helpers";
import { calculateExactPath } from "./move.helpers";

// ==========================================
// STEP 1: TARGET EVALUATOR (The "Who")
// ==========================================
function getPrioritizedTargets<C extends AIBattleUnit, T extends BattleUnit>(
	aiFigure: C,
	card: Card,
	figures: T[],
): T[] {
	const aliveFigures = figures.filter((f) => f.currentHp > 0);
	let validTargets: T[] = [];

	// 1. Filter by Play Requirement
	switch (card.playRequirement) {
		case "requires_ally":
			validTargets = aliveFigures.filter((f) => !areEnemies(aiFigure)(f));
			break;
		case "requires_enemy":
		case "requires_empty_cell": // For summons, enemies act as focal points to run from or approach
			validTargets = aliveFigures.filter(areEnemies(aiFigure));
			break;
		case "requires_entity":
			validTargets = aliveFigures.filter(
				(f) => !(isSummon(f) && f.allegiance === "NEUTRAL"),
			);
			break;
		default:
			validTargets = aliveFigures;
	}

	// 2. Sort by AI Preference
	return validTargets.sort((a, b) => {
		switch (card.aiTargetPreference) {
			case "lowestDef":
				return a.baseDef - b.baseDef;
			case "lowestHp":
				return a.currentHp - b.currentHp;
			case "random":
				return Math.random() - 0.5;
			default:
				// Default is "Closest" or "Away" (both rely on distance, "Away" just reverses the walk logic later)
				return (
					getDistanceToBoundingBox({ caster: aiFigure, target: a }) -
					getDistanceToBoundingBox({ caster: aiFigure, target: b })
				);
		}
	});
}

// ==========================================
// STEP 2: MOVEMENT CALCULATOR (The "How")
// ==========================================
const calculateFiringSpot = <C extends AIBattleUnit, T extends BattleUnit>(
	monster: C,
	targetFigure: T,
	card: Card,
	figures: T[],
): GridPosition | null => {
	if (monster.baseMove === 0) return monster.gridPosition;

	const canTargetSelf = ["requires_entity", "requires_ally"].includes(
		card.playRequirement,
	);
	const minRange = canTargetSelf ? 0 : 1;
	const hardObstacles = figures.filter(areEnemies(monster));

	// --- KITING LOGIC ("away") ---
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
			// If it's a summon, just ensure there's at least one valid empty tile to cast on from here
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
			// Pick the spot furthest away from the target
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
		return null;
	}

	// --- AGGRESSIVE LOGIC ---
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

// ==========================================
// STEP 3: THE ORCHESTRATOR
// ==========================================
export const getIdealTarget: TargetResolver = <C extends AIBattleUnit>(
	aiFigure: C,
	card: Card,
	figures: BattleUnit[],
) => {
	// --- FAST PATH: SELF ---
	if (card.aiTargetPreference === "self") {
		return {
			intendedTarget: aiFigure,
			moveDest: aiFigure.gridPosition,
			canHit: true,
		};
	}

	// --- FAST PATH: SPECIFIC GRID OVERRIDE ---
	if (card.aiTargetPreference && typeof card.aiTargetPreference !== "string") {
		const target = figures.find(isUnitInTile(card.aiTargetPreference));
		if (target) {
			const moveDest = calculateFiringSpot(aiFigure, target, card, figures);
			return {
				intendedTarget: target,
				moveDest,
				canHit: Boolean(
					moveDest &&
						isTargetInRange({
							card,
							minRange: 1,
							attacker: { ...aiFigure, gridPosition: moveDest },
							target,
						}),
				),
			};
		}
	}

	// --- STANDARD PIPELINE ---
	const targetQueue = getPrioritizedTargets(aiFigure, card, figures);

	let fallbackMove: GridPosition | null = null;
	let fallbackTarget: BattleUnit | null = null;

	for (const focalTarget of targetQueue) {
		const moveDest = calculateFiringSpot(aiFigure, focalTarget, card, figures);

		if (moveDest) {
			// Handle the Empty Cell / Terrain Cast
			if (card.playRequirement === "requires_empty_cell") {
				const possibleSpawns = calculateAttackableCells({
					attacker: { ...aiFigure, gridPosition: moveDest },
					rangeValue: card.range,
					canTargetSelf: false,
				})
					.filter(isTileInBounds)
					.filter(isTileEmpty(figures));

				if (possibleSpawns.length > 0) {
					return {
						intendedTarget: {
							gridPosition: possibleSpawns[0],
							size: { cols: 1, rows: 1 },
						},
						moveDest,
						canHit: true,
					};
				}
				continue; // Try next focal point
			}

			// Handle Standard Target Cast
			const minRange = ["requires_entity", "requires_ally"].includes(
				card.playRequirement,
			)
				? 0
				: 1;
			const canHit = isTargetInRange({
				card,
				minRange,
				attacker: { ...aiFigure, gridPosition: moveDest },
				target: focalTarget,
			});

			if (canHit) {
				return {
					intendedTarget: focalTarget,
					moveDest,
					canHit: true,
				};
			}

			if (!fallbackMove) {
				fallbackMove = moveDest;
				fallbackTarget = focalTarget;
			}
		}
	}

	// --- FALLBACK ---
	return {
		intendedTarget: fallbackTarget,
		moveDest: fallbackMove,
		canHit: false,
	};
};

function isTargetInRange<C extends BattleUnit, T extends BattleUnit>({
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
