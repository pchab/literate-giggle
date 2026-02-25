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
		monsters,
		heroes,
		usedCardsThisTurn,
		enemyAction,
		enemyIntents,
		hoveredCard,
		activeCard,
		resolveCard,
	} = useBattleStore(
		useShallow((state) => ({
			usedCardsThisTurn: state.usedCardsThisTurn,
			enemyAction: state.enemyAction,
			monsters: state.monsters,
			heroes: state.heroes,
			enemyIntents: state.enemyIntents,
			hoveredCard: state.hoveredCard,
			activeCard: state.activeCard,
			resolveCard: state.resolveCard,
		})),
	);

	const allDangerTiles = Object.values(enemyIntents || {}).flatMap(
		(intent) => intent.dangerZone || [],
	);

	const aliveHeroesCount = heroes.filter(
		({ currentHp }) => currentHp > 0,
	).length;

	// Updated isEnemyTurn logic to use activeCard
	const isEnemyTurn =
		!activeCard &&
		aliveHeroesCount > 0 &&
		Object.keys(usedCardsThisTurn).length === aliveHeroesCount;

	// --- 1. RANGE CALCULATIONS (Hover & Active) ---
	let validTargetCells: GridPosition[] = [];
	let isTargetingEnemy = false;
	let isTargetingAlly = false;
	let isTargetingEmpty = false;
	let canTargetSelf = false;

	// A helper to figure out the active card or hovered card
	const cardToPreview =
		activeCard?.card ||
		heroes
			.find((h) => h.id === hoveredCard?.heroId)
			?.cards.find((c) => c.id === hoveredCard?.cardId);

	const previewCaster = activeCard
		? heroes.find((h) => h.id === activeCard.heroId)
		: heroes.find((h) => h.id === hoveredCard?.heroId);

	if (cardToPreview && previewCaster) {
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
				monsters,
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

				const isDanger = allDangerTiles.some(
					(tile) => tile.col === cell.col && tile.row === cell.row,
				);
				const isHoveredHero =
					hoveredCard?.heroId && heroInCell?.id === hoveredCard.heroId;
				const inRange = validTargetCells.some(
					(pos) => pos.row === cell.row && pos.col === cell.col,
				);

				// --- 2. DYNAMIC CELL STYLING ---
				const baseClasses =
					"w-24 h-24 relative flex items-center justify-center transition-all duration-300";
				let stateClasses = "bg-zinc-900/30 border border-zinc-700/50 z-0";

				if (isDanger) {
					stateClasses =
						"bg-red-950/40 border border-red-600/70 shadow-[inset_0_0_15px_rgba(220,38,38,0.25)] z-10";
				} else if (isHoveredHero) {
					stateClasses =
						"bg-blue-900/40 border-2 border-blue-400 z-10 shadow-[inset_0_0_15px_rgba(59,130,246,0.5)]";
				} else if (inRange) {
					if (isTargetingEmpty && isCellEmpty) {
						stateClasses =
							"bg-blue-950/40 border border-blue-500/50 hover:bg-blue-900/50 z-10 cursor-pointer";
					} else if (isTargetingEnemy && enemyInCell) {
						stateClasses =
							"bg-orange-900/40 border border-orange-500/50 hover:bg-orange-800/50 z-10 shadow-[inset_0_0_15px_rgba(249,115,22,0.15)] cursor-crosshair";
					} else if (isTargetingAlly && heroInCell) {
						stateClasses =
							"bg-green-900/40 border border-green-500/50 hover:bg-green-800/50 z-10 shadow-[inset_0_0_15px_rgba(34,197,94,0.15)] cursor-pointer";
					}
				}

				// If holding a card, but this tile isn't valid, dim it
				const isInvalidTarget =
					activeCard &&
					(!inRange ||
						(isTargetingEmpty && !isCellEmpty) ||
						(isTargetingEnemy && !enemyInCell) ||
						(isTargetingAlly && !heroInCell));

				if (
					isInvalidTarget &&
					!canTargetSelf && heroInCell?.id !== previewCaster?.id 
				) {
					stateClasses += " cursor-not-allowed opacity-50";
				}

				// --- 3. RENDERING ---

				// A. EMPTY TILE
				if (isCellEmpty) {
					return (
						<button
							type="button"
							key={cell.id}
							className={`${baseClasses} ${stateClasses}`}
							onClick={() => {
								if (activeCard && inRange && isTargetingEmpty) {
									// Pass the coordinate string for empty cell targeting (like movement)
									resolveCard(cell);
								}
							}}
						>
							<span className="text-xs text-zinc-800 select-none absolute top-1 left-1">
								{cell.col},{cell.row}
							</span>
						</button>
					);
				}

				// B. ENEMY TILE
				if (enemyInCell) {
					return (
						<button
							type="button"
							key={cell.id}
							className={`${baseClasses} ${stateClasses}`}
							onClick={() => {
								if (activeCard && inRange && isTargetingEnemy) {
									resolveCard(enemyInCell.id);
								}
							}}
						>
							<span className="text-xs text-zinc-800 select-none absolute top-1 left-1">
								{cell.col},{cell.row}
							</span>
							<EnemySprite unitInCell={enemyInCell} key={cell.id} />
						</button>
					);
				}

				// C. HERO TILE
				return (
					<button
						type="button"
						key={cell.id}
						className={`${baseClasses} ${stateClasses} ${heroInCell ? "hover:brightness-110" : ""}`}
						onClick={() => {
							if (activeCard && inRange && isTargetingAlly && heroInCell) {
								resolveCard(heroInCell.id);
							}
							if (
								heroInCell &&
								canTargetSelf &&
								heroInCell.id === previewCaster?.id
							) {
								resolveCard(heroInCell.id);
							}
						}}
					>
						<span className="text-xs text-zinc-800 select-none absolute top-1 left-1">
							{cell.col},{cell.row}
						</span>
						{heroInCell && <HeroSprite unitInCell={heroInCell} key={cell.id} />}
					</button>
				);
			})}
		</div>
	);
}
