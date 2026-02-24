"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import {
	calculateReachableCells,
	GRID_BOUNDS,
} from "@/modules/grid/grid.helpers";
import type { GridPosition } from "@/modules/grid/grid.type";
import { useBattleStore } from "@/store/battle.store";
import EnemySprite from "./units/EnemySprite";
import HeroSprite from "./units/HeroSprite";

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
		moveHero,
		monsters,
		heroes,
		currentMove,
		usedCardsThisTurn,
		currentAttack,
		enemyAction,
		attackEnemy,
		enemyIntents,
		hoveredCard,
	} = useBattleStore(
		useShallow((state) => ({
			attackEnemy: state.attackEnemy,
			currentAttack: state.currentAttack,
			currentMove: state.currentMove,
			usedCardsThisTurn: state.usedCardsThisTurn,
			moveHero: state.moveHero,
			enemyAction: state.enemyAction,
			monsters: state.monsters,
			heroes: state.heroes,
			enemyIntents: state.enemyIntents,
			hoveredCard: state.hoveredCard,
		})),
	);

	const allDangerTiles = Object.values(enemyIntents || {}).flatMap(
		(intent) => intent.dangerZone || [],
	);

	const aliveHeroesCount = heroes.filter(
		({ currentHp }) => currentHp > 0,
	).length;
	const isEnemyTurn =
		!currentMove &&
		!currentAttack &&
		aliveHeroesCount > 0 &&
		Object.keys(usedCardsThisTurn).length === aliveHeroesCount;

	const hoveredHeroInfo = heroes.find((h) => h.id === hoveredCard?.heroId);
	const hoveredCardInfo = hoveredHeroInfo?.cards.find(
		(c) => c.id === hoveredCard?.cardId,
	);
	let hoverReachableCells: GridPosition[] = [];
	if (hoveredHeroInfo && hoveredCardInfo && hoveredCardInfo.action.move > 0) {
		hoverReachableCells = calculateReachableCells(
			hoveredHeroInfo.gridPosition,
			hoveredCardInfo.action.move,
			monsters,
		);
	}
	if (currentMove) {
		const [heroId, moveDistance] = currentMove;
		const movingHero = heroes.find((h) => h.id === heroId);
		if (movingHero) {
			hoverReachableCells = calculateReachableCells(
				movingHero.gridPosition,
				moveDistance,
				monsters,
			);
		}
	}

	useEffect(() => {
		if (isEnemyTurn) {
			const timeoutId = setTimeout(() => {
				enemyAction();
			}, 1000);
			return () => clearTimeout(timeoutId);
		}
	}, [isEnemyTurn, enemyAction]);

	return (
		<div
			className={`grid ${tailwindGridCols[GRID_BOUNDS.cols]} gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800 relative`}
		>
			{cells.map((cell) => {
				const enemyInCell = monsters
					.filter((m) => m.currentHp > 0)
					.find(
						({ gridPosition }) =>
							gridPosition.col === cell.col && gridPosition.row === cell.row,
					);
				const heroInCell = heroes
					.filter((m) => m.currentHp > 0)
					.find(
						({ gridPosition }) =>
							gridPosition.col === cell.col && gridPosition.row === cell.row,
					);

				const isCellEmpty = !enemyInCell && !heroInCell;

				// 3. Check if this specific cell is targeted by any enemy
				const isDanger = allDangerTiles.some(
					(tile) => tile.col === cell.col && tile.row === cell.row,
				);

				const isHoveredHero =
					hoveredCard?.heroId && heroInCell?.id === hoveredCard.heroId;
				const isReachable = hoverReachableCells.some(
					(pos) => pos.row === cell.row && pos.col === cell.col,
				);

				// 4. Define dynamic Tailwind classes based on danger status
				const baseClasses =
					"w-24 h-24 relative flex items-center justify-center transition-all duration-300";

				let stateClasses =
					"bg-zinc-900/30 border border-zinc-700/50 hover:bg-zinc-800 z-0";
				if (isDanger) {
					stateClasses =
						"bg-red-950/40 border border-red-600/70 hover:bg-red-900/50 shadow-[inset_0_0_15px_rgba(220,38,38,0.25)] z-10";
				} else if (isHoveredHero) {
					stateClasses =
						"bg-blue-900/40 border-2 border-blue-400 z-10 shadow-[inset_0_0_15px_rgba(59,130,246,0.5)]";
				} else if (isReachable) {
					stateClasses =
						"bg-blue-950/40 border border-blue-500/50 hover:bg-blue-900/50 z-10";
				}

				if (isCellEmpty) {
					return (
						<button
							type="button"
							key={cell.id}
							className={`${baseClasses} ${stateClasses}`}
							title={`Cell [${cell.col}, ${cell.row}]`}
							onClick={() => moveHero(cell)}
						>
							<span className="text-xs text-zinc-800 select-none absolute top-1 left-1">
								{cell.col},{cell.row}
							</span>
						</button>
					);
				}

				if (enemyInCell) {
					return (
						<button
							type="button"
							key={cell.id}
							className={`${baseClasses} ${stateClasses}`}
							title={`Cell [${cell.col}, ${cell.row}]`}
							onClick={() =>
								currentAttack && attackEnemy(enemyInCell.id, currentAttack[1])
							}
						>
							<span className="text-xs text-zinc-800 select-none absolute top-1 left-1">
								{cell.col},{cell.row}
							</span>
							<EnemySprite unitInCell={enemyInCell} key={cell.id} />
						</button>
					);
				}

				return (
					<div key={cell.id} className={`${baseClasses} ${stateClasses}`}>
						<span className="text-xs text-zinc-800 select-none absolute top-1 left-1">
							{cell.col},{cell.row}
						</span>
						{heroInCell && <HeroSprite unitInCell={heroInCell} key={cell.id} />}
					</div>
				);
			})}
		</div>
	);
}
