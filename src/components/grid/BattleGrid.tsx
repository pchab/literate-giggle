"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import {
	calculateAttackableCells,
	calculateReachableCells,
	GRID_BOUNDS,
} from "@/modules/grid/grid.helpers";
import type { GridPosition } from "@/modules/grid/grid.type";
import { useBattleStore } from "@/store/battle.store";
import { GridCell } from "./GridCell";

const cells = Array.from({ length: GRID_BOUNDS.rows }, (_, col) => {
	return Array.from({ length: GRID_BOUNDS.cols }, (_, row) => {
		return { id: `${col}-${row}`, col, row };
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
		enemyIntents,
		hoveredCard,
		activeCard,
		resolveCard,
		activeMoveHeroId,
		moveHero,
		setActiveMoveHeroId,
		usedMovesThisTurn,
	} = useBattleStore(
		useShallow((state) => ({
			usedCardsThisTurn: state.usedCardsThisTurn,
			enemyAction: state.enemyAction,
			monsters: state.monsters,
			heroes: state.heroes,
			summons: state.summons,
			enemyIntents: state.enemyIntents,
			hoveredCard: state.hoveredCard,
			activeCard: state.activeCard,
			resolveCard: state.resolveCard,
			activeMoveHeroId: state.activeMoveHeroId,
			moveHero: state.moveHero,
			setActiveMoveHeroId: state.setActiveMoveHeroId,
			usedMovesThisTurn: state.usedMovesThisTurn,
		})),
	);

	const allDangerTiles = Object.values(enemyIntents || {}).flatMap(
		(intent) => intent.dangerZone || [],
	);

	const aliveHeroesCount = heroes.filter((h) => h.currentHp > 0).length;

	const isEnemyTurn =
		!activeCard &&
		!activeMoveHeroId &&
		aliveHeroesCount > 0 &&
		Object.keys(usedCardsThisTurn).length === aliveHeroesCount;

	// --- 1. RANGE CALCULATIONS ---
	let validTargetCells: GridPosition[] = [];
	let isTargetingEnemy = false;
	let isTargetingAlly = false;
	let isTargetingEmpty = false;
	let canTargetSelf = false;
	let isMoving = false;

	const cardToPreview =
		activeCard?.card ||
		heroes
			.find((h) => h.id === hoveredCard?.heroId)
			?.cards.find((c) => c.id === hoveredCard?.cardId);

	const previewCaster = activeCard
		? heroes.find((h) => h.id === activeCard.heroId)
		: heroes.find((h) => h.id === hoveredCard?.heroId);

	// [NEW]: Handle Movement Range Calculation
	if (activeMoveHeroId) {
		const movingHero = heroes.find((h) => h.id === activeMoveHeroId);
		if (movingHero) {
			isMoving = true;
			isTargetingEmpty = true;
			canTargetSelf = false;
			validTargetCells = calculateReachableCells(
				movingHero.gridPosition,
				movingHero.baseMove,
				[...monsters, ...summons.filter((s) => s.allegiance === "ENEMY")],
				true,
			);
		}
	}
	// Handle Card Range Calculation
	else if (cardToPreview && previewCaster) {
		const req = cardToPreview.playRequirement;
		isTargetingEnemy = req === "requires_enemy";
		isTargetingAlly =
			req === "requires_ally" || req === "requires_ally_or_self";
		isTargetingEmpty =
			req === "requires_empty_cell" || req === "requires_empty_cell_or_self";
		canTargetSelf =
			req === "requires_ally_or_self" || req === "requires_empty_cell_or_self";

		if (isTargetingEmpty) {
			validTargetCells = calculateReachableCells(
				previewCaster.gridPosition,
				cardToPreview.range,
				[...monsters, ...summons.filter((s) => s.allegiance === "ENEMY")],
				canTargetSelf,
			);
		} else {
			validTargetCells = calculateAttackableCells(
				previewCaster.gridPosition,
				cardToPreview.range,
				canTargetSelf,
			);
		}
	}

	useEffect(() => {
		if (isEnemyTurn) {
			const timeoutId = setTimeout(() => enemyAction(), 1000);
			return () => clearTimeout(timeoutId);
		}
	}, [isEnemyTurn, enemyAction]);

	return (
		<div
			className={`grid ${tailwindGridCols[GRID_BOUNDS.cols]} gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800 relative`}
		>
			{cells.map((cell) => {
				const enemyInCell = monsters.find(
					(m) =>
						m.currentHp > 0 &&
						m.gridPosition.col === cell.col &&
						m.gridPosition.row === cell.row,
				);
				const heroInCell = heroes.find(
					(h) =>
						h.currentHp > 0 &&
						h.gridPosition.col === cell.col &&
						h.gridPosition.row === cell.row,
				);
				const summonInCell = summons.find(
					(s) =>
						s.currentHp > 0 &&
						s.gridPosition.col === cell.col &&
						s.gridPosition.row === cell.row,
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
						enemyInCell={enemyInCell}
						heroInCell={heroInCell}
						summonInCell={summonInCell}
						isDanger={isDanger}
						inRange={inRange}
						isTargetingEmpty={isTargetingEmpty}
						isTargetingEnemy={isTargetingEnemy}
						isTargetingAlly={isTargetingAlly}
						isMoving={isMoving}
						canTargetSelf={canTargetSelf}
						hasActiveAction={!!activeCard}
						previewCasterId={previewCaster?.id}
						hoveredHeroId={hoveredCard?.heroId}
						onResolveCard={resolveCard}
						onMoveHero={moveHero}
						activeMoveHeroId={activeMoveHeroId}
						onSelectForMove={setActiveMoveHeroId}
						hasMoved={heroInCell ? !!usedMovesThisTurn[heroInCell.id] : false}
					/>
				);
			})}
		</div>
	);
}
