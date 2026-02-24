"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { GRID_BOUNDS } from "@/modules/grid/grid.helpers";
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

				// 4. Define dynamic Tailwind classes based on danger status
				const baseClasses =
					"w-24 h-24 relative flex items-center justify-center transition-all duration-300";
				const dangerClasses = isDanger
					? "bg-red-950/40 border border-red-600/70 hover:bg-red-900/50 shadow-[inset_0_0_15px_rgba(220,38,38,0.25)] z-10"
					: "bg-zinc-900/30 border border-zinc-700/50 hover:bg-zinc-800 z-0";

				if (isCellEmpty) {
					return (
						<button
							type="button"
							key={cell.id}
							className={`${baseClasses} ${dangerClasses}`}
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
							className={`${baseClasses} ${dangerClasses}`}
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
					<div key={cell.id} className={`${baseClasses} ${dangerClasses}`}>
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
