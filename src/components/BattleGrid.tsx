"use client";

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
	const { moveHero, monsters, heroes, currentAttack, attackEnemy } = useBattleStore(
		useShallow((state) => ({
			attackEnemy: state.attackEnemy,
			currentAttack: state.currentAttack,
			moveHero: state.moveHero,
			monsters: state.monsters,
			heroes: state.heroes,
		})),
	);

	return (
		<div
			className={`grid ${tailwindGridCols[GRID_BOUNDS.cols]} gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800 relative`}
		>
			{cells.map((cell) => {
				const enemyInCell = monsters.find(
					({ gridPosition }) =>
						gridPosition.col === cell.col && gridPosition.row === cell.row,
				);
				const heroInCell = heroes.find(
					({ gridPosition }) =>
						gridPosition.col === cell.col && gridPosition.row === cell.row,
				);

				const isCellEmpty = !enemyInCell && !heroInCell;

				if (isCellEmpty) {
					return (
						<button
							type="button"
							key={cell.id}
							className={
								"w-24 h-24 border border-zinc-700/50 bg-zinc-900/30 hover:bg-zinc-800 transition-colors relative flex items-center justify-center"
							}
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
							className={
								"w-24 h-24 border border-zinc-700/50 bg-zinc-900/30 hover:bg-zinc-800 transition-colors relative flex items-center justify-center"
							}
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
					<div
						key={cell.id}
						className={
							"relative w-24 h-24 border border-zinc-700/50 bg-zinc-900/30 hover:bg-zinc-800 transition-colors flex items-center justify-center"
						}
					>
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
