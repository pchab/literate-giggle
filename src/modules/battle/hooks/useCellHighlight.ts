import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import type { GridPosition } from "@/modules/battle/domain/grid.type";
import {
	calculateAttackableCells,
	calculateReachableCells,
	getLineOfSightPath,
	getManhattanDistance,
	isTileEmpty,
	isTileOccupied,
	isUnitInTile,
	rotatePattern,
} from "@/modules/battle/helpers/grid.helpers";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import { cardLibrary } from "@/modules/cards/data/cards.data";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { getActualTarget } from "../helpers/ai.move.helpers";
import { areEnemies } from "../helpers/effects/effect.helpers";
import { calculateExactPath } from "../helpers/move.helpers";

export type CellHighlight = {
	activeUnit?: BattleUnit["id"];
	moveCells?: GridPosition[];
	allyTargets?: GridPosition[];
	enemyTargets?: GridPosition[];
	cellTargets?: GridPosition[];
};

export function useCellHighlight(): CellHighlight {
	const {
		heroes,
		monsters,
		summons,
		aiIntents,
		usedCardsThisTurn,
		activeHeroCard,
		hoveredHeroCard,
		activeMoveHeroId,
		hoveredCell,
		enemyAction,
		...store
	} = useBattleStore(
		useShallow((state) => ({
			usedCardsThisTurn: state.usedCardsThisTurn,
			enemyAction: state.enemyAction,
			monsters: state.monsters,
			heroes: state.heroes,
			summons: state.summons,
			aiIntents: state.aiIntents,
			activeHeroCard: state.activeHeroCard,
			hoveredHeroCard: state.hoveredHeroCard,
			resolveCard: state.resolveCard,
			hoveredCell: state.hoveredCell,
			activeMoveHeroId: state.activeMoveHeroId,
			moveHero: state.moveHero,
			setActiveMoveHeroId: state.setActiveMoveHeroId,
			usedMovesThisTurn: state.usedMovesThisTurn,
		})),
	);

	// --- ENEMY TURN TRIGGER ---
	const aliveHeroesCount = heroes.filter((h) => h.currentHp > 0).length;
	const isEnemyTurn =
		!activeHeroCard &&
		aliveHeroesCount > 0 &&
		Object.keys(usedCardsThisTurn).length === aliveHeroesCount;

	useEffect(() => {
		if (isEnemyTurn) {
			const timeoutId = setTimeout(() => enemyAction(), 200);
			return () => clearTimeout(timeoutId);
		}
	}, [isEnemyTurn, enemyAction]);

	const allUnits = [...heroes, ...monsters, ...summons];

	// --- HIGHLIGHT CELLS FOR HERO ACTION ---
	// ----- CASE 1: HERO MOVING -----
	if (activeMoveHeroId) {
		const hero = heroes.find(({ id }) => id === activeMoveHeroId);
		if (!hero) {
			return {};
		}

		const remainingMove =
			hero.baseMove - (store.usedMovesThisTurn[hero.id] ?? 0);
		const oppositeFaction = allUnits.filter(areEnemies(hero));
		const validTargetCells = calculateReachableCells(
			hero.gridPosition,
			remainingMove,
			oppositeFaction,
			false,
		).filter(isTileEmpty(oppositeFaction));

		return {
			activeUnit: hero.id,
			moveCells: validTargetCells,
		};
	}

	// ----- CASE 2: HERO USING CARD -----
	if (activeHeroCard || hoveredHeroCard) {
		const { unitId, card } = activeHeroCard ?? hoveredHeroCard ?? {};
		const hero = heroes.find(({ id }) => id === unitId);
		if (!hero || !card) {
			return {};
		}

		const allyFaction = [
			...heroes,
			...summons.filter(({ allegiance }) => allegiance === "PLAYER"),
		];
		const enemyFaction = [
			...monsters,
			...summons.filter(({ allegiance }) => allegiance === "ENEMY"),
		];
		const cellHighlight: CellHighlight = {
			activeUnit: hero.id,
			moveCells: [],
			allyTargets: [],
			enemyTargets: [],
			cellTargets: [],
		};

		const { playRequirement } = card;
		if (
			hoveredCell &&
			card.range > 1 &&
			getManhattanDistance(hoveredCell, hero.gridPosition) <= card.range
		) {
			const collision = getActualTarget(
				hero.gridPosition,
				hoveredCell,
				allUnits,
			);
			cellHighlight.moveCells = getLineOfSightPath(
				hero.gridPosition,
				hoveredCell,
			);
			const targetedCell = collision?.gridPosition ?? hoveredCell;
			let targetedCells = [targetedCell];
			if (card.aoePattern) {
				const rotatedPattern = rotatePattern(
					card.aoePattern,
					hero.gridPosition,
					targetedCell,
				);

				targetedCells = rotatedPattern.map((p) => ({
					col: targetedCell.col + p.col,
					row: targetedCell.row + p.row,
				}));
			}

			if (playRequirement === "requires_enemy") {
				cellHighlight.enemyTargets = targetedCells;
			}
			if (playRequirement === "requires_ally") {
				cellHighlight.allyTargets = targetedCells;
			}
		} else {
			if (playRequirement === "requires_enemy") {
				cellHighlight.enemyTargets = calculateAttackableCells(
					hero.gridPosition,
					card.range,
					false,
				).filter(isTileOccupied(enemyFaction));
			}

			if (playRequirement === "requires_ally") {
				cellHighlight.allyTargets = calculateAttackableCells(
					hero.gridPosition,
					card.range,
					true,
				).filter(isTileOccupied(allyFaction));
			}
		}

		return cellHighlight;
	}

	// --- HIGHLIGHT CELLS FOR ENEMY ACTION ---
	if (hoveredCell) {
		const hoveredHeroUnit = heroes.find(isUnitInTile(hoveredCell));
		if (hoveredHeroUnit) {
			return {
				activeUnit: hoveredHeroUnit.id,
			}
		}

		const hoveredAiUnit = [...monsters, ...summons].find(
			isUnitInTile(hoveredCell),
		);
		if (!hoveredAiUnit) {
			return {};
		}
		const AIIntent = aiIntents[hoveredAiUnit.id];
		if (!AIIntent) {
			return {};
		}

		const oppositeFaction = [
			...heroes,
			...summons.filter(({ allegiance }) => allegiance !== "ENEMY"),
		];
		const { playRequirement } = cardLibrary[AIIntent.cardId];

		return {
			activeUnit: hoveredAiUnit.id,
			moveCells: calculateExactPath(
				hoveredAiUnit.gridPosition,
				AIIntent.intendedMove,
				oppositeFaction,
			),
			allyTargets:
				playRequirement === "requires_ally" ? AIIntent.dangerZone : [],
			enemyTargets:
				playRequirement === "requires_enemy" ? AIIntent.dangerZone : [],
			cellTargets:
				playRequirement === "requires_empty_cell" ? AIIntent.dangerZone : [],
		};
	}

	return {};
}
