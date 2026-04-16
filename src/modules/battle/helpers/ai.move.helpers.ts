import type { Card } from "@/modules/cards/domain/cards.type";
import { isSummon } from "@/modules/units/helpers/units.helpers";
import type { AIBattleUnit, BattleUnit } from "../../units/domain/units.type";
import type { BoundingBox, GridPosition } from "../domain/grid.type";
import type { BattleGet } from "../store/battle.store";
import type { TargetResolver } from "./ai.targeting.helpers";
import { areEnemies, getAllegiance } from "./effects/effect.helpers";
import {
	canUnitFit,
	getDistanceToBoundingBox,
	isTileEmpty,
	isTileInBounds,
} from "./grid.helpers";
import {
	calculateAttackableCells,
	calculateExactPath,
	calculateReachableCells,
} from "./move.helpers";

// ==========================================
// STEP 1: TARGET EVALUATOR (The "Who")
// ==========================================
function getPrioritizedTargets<C extends AIBattleUnit, T extends BattleUnit>(
	aiUnit: C,
	card: Card,
	units: T[],
): T[] {
	const aliveUnits = units.filter((f) => f.currentHp > 0);
	const nonNeutralUnits = units.filter(
		(u) => !isSummon(u) || u.allegiance !== "NEUTRAL",
	);
	let validTargets: T[] = [];

	// 1. Filter by Play Requirement
	switch (card.playRequirement) {
		case "requires_ally":
			validTargets = nonNeutralUnits.filter((f) => !areEnemies(aiUnit)(f));
			break;
		case "requires_enemy":
			validTargets = nonNeutralUnits.filter(areEnemies(aiUnit));
			break;
		case "requires_empty_cell":
			validTargets = aliveUnits.filter(areEnemies(aiUnit));
			break;
		case "requires_entity":
			validTargets = aliveUnits.filter(
				(f) => !(isSummon(f) && f.allegiance === "NEUTRAL"),
			);
			break;
		default:
			validTargets = aliveUnits;
	}

	// Determine what this specific AI considers a "Primary Threat"
	const aiFaction = getAllegiance(aiUnit);
	const primaryEnemyFaction =
		aiFaction === "ENEMY" ? "PLAYER" : aiFaction === "PLAYER" ? "ENEMY" : null;

	// 2. Sort by AI Preference
	return validTargets.sort((a, b) => {
		// --- NEW: Faction Prioritization ---
		// Direct enemies take priority over neutral bystanders
		if (primaryEnemyFaction) {
			const aIsPrimaryEnemy = getAllegiance(a) === primaryEnemyFaction;
			const bIsPrimaryEnemy = getAllegiance(b) === primaryEnemyFaction;

			if (aIsPrimaryEnemy && !bIsPrimaryEnemy) return -1;
			if (!aIsPrimaryEnemy && bIsPrimaryEnemy) return 1;
		}

		// --- ORIGINAL: Fallback Preference ---
		switch (card.aiTargetPreference) {
			case "lowestDef":
				return a.baseDef - b.baseDef;
			case "lowestHp":
				return a.currentHp - b.currentHp;
			case "random":
				return Math.random() - 0.5;
			default:
				return (
					getDistanceToBoundingBox({ caster: aiUnit, target: a }) -
					getDistanceToBoundingBox({ caster: aiUnit, target: b })
				);
		}
	});
}

// ==========================================
// STEP 2: MOVEMENT CALCULATOR (The "How")
// ==========================================
const calculateFiringSpot =
	(get: BattleGet) =>
	<C extends AIBattleUnit, T extends BoundingBox>({
		aiUnit,
		target,
		card,
	}: {
		aiUnit: C;
		target: T;
		card: Card;
	}): GridPosition | null => {
		if (aiUnit.baseMove === 0) return aiUnit.gridPosition;
		const { units, gridSize, removedCells, surfaces } = get();

		const canTargetSelf = ["requires_entity", "requires_ally"].includes(
			card.playRequirement,
		);
		const minRange = Math.min(canTargetSelf ? 0 : 1, card.range);
		const hardObstacles = units.filter(areEnemies(aiUnit));

		if (card.aiTargetPreference === "away") {
			// --- KITING LOGIC ("away") ---
			const reachable = calculateReachableCells({
				movingUnit: aiUnit,
				blockingUnits: hardObstacles,
				canTargetSelf: true,
				gridSize,
				removedCells,
				surfaces,
			});

			const validStops = reachable.filter((cell) =>
				canUnitFit({
					unit: { ...aiUnit, gridPosition: cell },
					units,
					gridSize,
					removedCells,
				}),
			);

			const firingSpots = validStops.filter((cell) => {
				if (card.playRequirement === "requires_empty_cell") {
					const possibleSpawns = calculateAttackableCells({
						attacker: { ...aiUnit, gridPosition: cell },
						rangeValue: card.range,
						canTargetSelf: false,
						gridSize,
					})
						.filter(isTileInBounds(gridSize, removedCells))
						.filter(isTileEmpty(units));
					return possibleSpawns.length > 0;
				}

				return isTargetInRange({
					card,
					minRange,
					attacker: { ...aiUnit, gridPosition: cell },
					target,
				});
			});

			if (firingSpots.length > 0) {
				firingSpots.sort((a, b) => {
					const distA = getDistanceToBoundingBox({
						caster: { ...aiUnit, gridPosition: a },
						target,
					});
					const distB = getDistanceToBoundingBox({
						caster: { ...aiUnit, gridPosition: b },
						target,
					});
					return distB - distA;
				});
				return firingSpots[0];
			}
			return null;
		}

		// --- AGGRESSIVE LOGIC ---
		const distance = getDistanceToBoundingBox({
			caster: aiUnit,
			target,
		});
		if (distance >= minRange && distance <= card.range) {
			return aiUnit.gridPosition;
		}

		const fullPath = calculateExactPath({
			movingUnit: aiUnit,
			targetPos: target.gridPosition,
			units: hardObstacles,
			minRange,
			maxRange: card.range,
			gridSize,
			removedCells,
			surfaces,
		});

		if (fullPath.length === 0) return null;

		let stepsToTake = Math.min(aiUnit.baseMove, fullPath.length);
		while (stepsToTake > 0) {
			const candidateDest = fullPath[stepsToTake - 1];
			if (
				canUnitFit({
					unit: { ...aiUnit, gridPosition: candidateDest },
					units,
					gridSize,
					removedCells,
				})
			) {
				return candidateDest;
			}
			stepsToTake--;
		}

		return aiUnit.gridPosition;
	};

// ==========================================
// STEP 3: THE ORCHESTRATOR
// ==========================================
export const getIdealTarget: TargetResolver =
	(get) =>
	<C extends AIBattleUnit>(aiUnit: C, card: Card) => {
		const { units, gridSize, removedCells } = get();
		// --- FAST PATH: SELF ---
		if (card.aiTargetPreference === "self") {
			return {
				intendedTarget: aiUnit,
				moveDest: aiUnit.gridPosition,
				canHit: true,
			};
		}

		// --- FAST PATH: SPECIFIC GRID OVERRIDE ---
		if (
			card.aiTargetPreference &&
			typeof card.aiTargetPreference !== "string"
		) {
			const target = { gridPosition: card.aiTargetPreference };
			const moveDest = calculateFiringSpot(get)({ aiUnit, target, card });
			return {
				intendedTarget: target,
				moveDest,
				canHit: Boolean(
					moveDest &&
						isTargetInRange({
							card,
							minRange: 1,
							attacker: { ...aiUnit, gridPosition: moveDest },
							target,
						}),
				),
			};
		}

		// --- STANDARD PIPELINE ---
		const targetQueue = getPrioritizedTargets(aiUnit, card, units);

		let fallbackMove: GridPosition | null = null;
		let fallbackTarget: BattleUnit | null = null;

		for (const focalTarget of targetQueue) {
			const moveDest = calculateFiringSpot(get)({
				aiUnit,
				target: focalTarget,
				card,
			});

			if (moveDest) {
				if (card.playRequirement === "requires_empty_cell") {
					const possibleSpawns = calculateAttackableCells({
						attacker: { ...aiUnit, gridPosition: moveDest },
						rangeValue: card.range,
						canTargetSelf: false,
						gridSize,
					})
						.filter(isTileInBounds(gridSize, removedCells))
						.filter(isTileEmpty(units));

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
					continue;
				}

				const minRange = ["requires_entity", "requires_ally"].includes(
					card.playRequirement,
				)
					? 0
					: 1;
				const canHit = isTargetInRange({
					card,
					minRange,
					attacker: { ...aiUnit, gridPosition: moveDest },
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

		return {
			intendedTarget: fallbackTarget,
			moveDest: fallbackMove,
			canHit: false,
		};
	};

function isTargetInRange<C extends BattleUnit, T extends BoundingBox>({
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
