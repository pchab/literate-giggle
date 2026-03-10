"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import type { GridPosition } from "@/modules/battle/domain/grid.type";
import {
	calculateAttackableCells,
	calculateReachableCells,
	GRID_BOUNDS,
	getCellId,
	isTileOccupied,
} from "@/modules/battle/helpers/grid.helpers";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { isHeroId } from "@/modules/figures/helpers/figures.helpers";
import { GridCell, type Targeting } from "./GridCell";

const cells = Array.from({ length: GRID_BOUNDS.rows }, (_, col) => {
	return Array.from({ length: GRID_BOUNDS.cols }, (_, row) => {
		return { id: getCellId({ col, row }), col, row };
	});
}).flat();

const tailwindGridCols = [
	"grid-cols-0",
	"grid-cols-1",
	"grid-cols-2",
	"grid-cols-3",
	"grid-cols-4",
	"grid-cols-5",
];

export function BattleGrid() {
	const {
		monsters,
		heroes,
		summons,
		usedCardsThisTurn,
		enemyAction,
		aiIntents,
		hoveredCard,
		activeCard,
		resolveCard,
		activeMoveUnitId,
		moveHero,
		setActiveMoveHeroId,
		usedMovesThisTurn,
	} = useBattleStore(
		useShallow((state) => ({
			usedCardsThisTurn: state.usedCardsThisTurn,
			enemyAction: state.enemyAction, // (Assuming this points to your new resolveAIActions!)
			monsters: state.monsters,
			heroes: state.heroes,
			summons: state.summons,
			aiIntents: state.aiIntents,
			hoveredCard: state.hoveredCard,
			activeCard: state.activeCard,
			resolveCard: state.resolveCard,
			activeMoveUnitId: state.activeMoveUnitId,
			moveHero: state.moveHero,
			setActiveMoveHeroId: state.setActiveMoveHeroId,
			usedMovesThisTurn: state.usedMovesThisTurn,
		})),
	);

	const allDangerTiles = Object.values(aiIntents || {}).flatMap(
		(intent) => intent.dangerZone || [],
	);

	const aliveHeroesCount = heroes.filter((h) => h.currentHp > 0).length;

	const isEnemyTurn =
		!activeCard &&
		aliveHeroesCount > 0 &&
		Object.keys(usedCardsThisTurn).length === aliveHeroesCount;

	// --- 1. RANGE CALCULATIONS ---
	let validTargetCells: GridPosition[] = [];
	let targeting: Targeting = "none";

	const cardToPreview = activeCard
		? activeCard.card
		: hoveredCard
			? hoveredCard.card
			: null;

	const previewCaster = activeCard
		? heroes.find((h) => h.id === activeCard.unitId)
		: heroes.find((h) => h.id === hoveredCard?.heroId);

	const allObstacles = [...monsters, ...heroes, ...summons];
	const allyFaction = [
		...heroes,
		...summons.filter(({ allegiance }) => allegiance === "PLAYER"),
	];
	const enemyFaction = [
		...monsters,
		...summons.filter(({ allegiance }) => allegiance === "ENEMY"),
	];

	// Handle Movement Range Calculation
	if (activeMoveUnitId) {
		const movingHero = heroes.find((h) => h.id === activeMoveUnitId);
		if (movingHero) {
			targeting = "cell";
			validTargetCells = calculateReachableCells(
				movingHero.gridPosition,
				movingHero.baseMove,
				enemyFaction,
				false,
			).filter((cell) => !isTileOccupied(cell, allyFaction));
		}
	}
	// Handle Card Range Calculation
	else if (cardToPreview && previewCaster) {
		const req = cardToPreview.playRequirement;
		if (req === "requires_enemy") {
			targeting = "enemy";
		}
		if (req === "requires_ally") {
			targeting = "ally";
		}
		if (req === "requires_empty_cell") {
			targeting = "cell";
		}

		if (targeting === "cell") {
			validTargetCells = calculateReachableCells(
				previewCaster.gridPosition,
				cardToPreview.range,
				allObstacles.filter((o) => o.id !== previewCaster.id),
			).filter((cell) => !isTileOccupied(cell, allObstacles));
		} else {
			const obstacles = targeting === "ally" ? allyFaction : enemyFaction;
			validTargetCells = calculateAttackableCells(
				previewCaster.gridPosition,
				cardToPreview.range,
				targeting === "ally",
			).filter((cell) => isTileOccupied<BattleUnit>(cell, obstacles));
		}
	}

	useEffect(() => {
		if (isEnemyTurn) {
			const timeoutId = setTimeout(() => enemyAction(), 200);
			return () => clearTimeout(timeoutId);
		}
	}, [isEnemyTurn, enemyAction]);

	return (
		<div
			className={`grid ${tailwindGridCols[GRID_BOUNDS.cols]} gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800 relative`}
		>
			{cells.map((cell) => {
				const unitsInCell = [...monsters, ...heroes, ...summons].filter(
					(m) =>
						m.currentHp > 0 &&
						m.gridPosition.col === cell.col &&
						m.gridPosition.row === cell.row,
				);

				const isDanger = allDangerTiles.some(
					(t) => t.col === cell.col && t.row === cell.row,
				);
				const inRange = validTargetCells.some(
					(pos) => pos.row === cell.row && pos.col === cell.col,
				);

				return (
					<GridCell
						key={cell.id}
						cell={cell}
						unitsInCell={unitsInCell}
						isDanger={isDanger}
						inRange={inRange}
						targeting={targeting}
						hasActiveAction={!!activeCard}
						hoveredHeroId={hoveredCard?.heroId}
						onResolveCard={resolveCard}
						onMoveHero={moveHero}
						activeMoveHeroId={
							activeMoveUnitId && isHeroId(activeMoveUnitId)
								? activeMoveUnitId
								: null
						}
						onSelectForMove={setActiveMoveHeroId}
						hasMoved={
							unitsInCell.length > 0 && isHeroId(unitsInCell[0].id)
								? !!usedMovesThisTurn[unitsInCell[0].id]
								: false
						}
					/>
				);
			})}
		</div>
	);
}
