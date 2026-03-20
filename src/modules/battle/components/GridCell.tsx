"use client";

import Image from "next/image";
import { useShallow } from "zustand/shallow";
import type { GridPosition } from "@/modules/battle/domain/grid.type";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import { UnitSprite } from "@/modules/figures/components/UnitSprite";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { VfxOverlay } from "./VfxOverlay";

export type Highlight =
	| "default"
	| "active"
	| "move"
	| "target_cell"
	| "target_ally"
	| "target_enemy"
	| "invalid";

interface GridCellProps {
	cell: { id: string } & GridPosition;
	unitsInCell: BattleUnit[];
	highlight?: Highlight;
	isProjectedLanding?: boolean;
	projectedCasualtyIds?: Set<BattleUnit["id"]>;
	onClick: () => void;
}

const highlightClassMapping: Record<Highlight, string> = {
	default:
		"bg-zinc-950/40 border border-zinc-800/60 z-0 backdrop-blur-[2px] hover:brightness-110",
	active:
		"bg-blue-900/40 border-2 border-blue-400 z-10 shadow-[inset_0_0_15px_rgba(59,130,246,0.5)] backdrop-blur-none hover:brightness-110",
	move: "bg-blue-950/50 border border-blue-500/50 hover:bg-blue-900/60 z-10 cursor-pointer backdrop-blur-none hover:brightness-110",
	target_cell:
		"bg-orange-900/50 border border-orange-500/50 hover:bg-orange-800/60 z-10 shadow-[inset_0_0_15px_rgba(249,115,22,0.2)] cursor-crosshair backdrop-blur-none hover:brightness-110",
	target_ally:
		"bg-green-900/50 border border-green-500/50 hover:bg-green-800/60 z-10 shadow-[inset_0_0_15px_rgba(34,197,94,0.2)] cursor-pointer backdrop-blur-none hover:brightness-110",
	target_enemy:
		"bg-red-950/50 border border-red-600/70 shadow-[inset_0_0_15px_rgba(220,38,38,0.3)] z-10 backdrop-blur-none hover:brightness-110",
	invalid:
		"bg-zinc-950/40 border border-zinc-800/60 z-0 backdrop-blur-[2px] cursor-not-allowed opacity-50",
};

export function GridCell({
	cell,
	unitsInCell,
	highlight = "default",
	isProjectedLanding,
	projectedCasualtyIds,
	onClick,
}: GridCellProps) {
	const { setHoveredCell, currentVfx, setVfx, surfaces } = useBattleStore(
		useShallow((state) => ({
			setHoveredCell: state.setHoveredCell,
			currentVfx: state.currentVfx,
			setVfx: state.setVfx,
			surfaces: state.surfaces,
		})),
	);

	const baseClasses =
		"w-grid h-grid relative flex items-center justify-center transition-colors duration-300";
	const stateClasses = highlightClassMapping[highlight];
	const surface = surfaces[cell.id];

	return (
		<button
			type="button"
			className={`${baseClasses} ${stateClasses}`}
			onClick={onClick}
			onMouseEnter={() => setHoveredCell(cell)}
			onMouseLeave={() => setHoveredCell(null)}
		>
			<span className="text-[10px] text-zinc-500 font-bold select-none absolute top-1 left-1 pointer-events-none">
				{cell.col},{cell.row}
			</span>

			{/* --- PROJECTED LANDING HIGHLIGHT --- */}
			{isProjectedLanding && (
				<div className="absolute inset-0 border-2 border-dashed border-yellow-400 bg-yellow-400/20 z-20 pointer-events-none" />
			)}

			{surface && (
				<div className="absolute inset-4 z-0 pointer-events-none flex items-center justify-center">
					<Image
						src={surface.spriteBase}
						alt={surface.type}
						fill
						className="rounded mix-blend-screen"
					/>
				</div>
			)}

			{unitsInCell.map((unit) => {
				const isDying = projectedCasualtyIds?.has(unit.id);

				return (
					<div key={unit.id}>
						<UnitSprite unitInCell={unit} />

						{/* --- PROJECTED CASUALTY INDICATOR --- */}
						{isDying && (
							<div className="absolute -top-2 -right-2 text-red-500 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-xl pointer-events-none">
								☠
							</div>
						)}
					</div>
				);
			})}

			<VfxOverlay
				vfx={currentVfx[cell.id]}
				onComplete={() => setVfx(cell.id, null)}
			/>
		</button>
	);
}
