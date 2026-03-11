"use client";

import Image from "next/image";
import { useShallow } from "zustand/shallow";
import type { GridPosition } from "@/modules/battle/domain/grid.type";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { AnchorTarget } from "@/modules/cards/domain/cards.type";
import { UnitSprite } from "@/modules/figures/components/UnitSprite";
import type {
	BattleHero,
	BattleUnit,
} from "@/modules/figures/domain/figures.type";
import { isHero } from "@/modules/figures/helpers/figures.helpers";
import { VfxOverlay } from "./VfxOverlay";

export type Targeting =
	| "ally"
	| "enemy"
	| "cell"
	| "self"
	| "invalid"
	| "none"
	| "cell_or_enemy";

interface GridCellProps {
	cell: { id: string } & GridPosition;
	unitsInCell: BattleUnit[];
	isDanger: boolean;
	inRange: boolean;
	targeting: Targeting;
	hasActiveAction: boolean;
	hoveredHeroId?: BattleHero["id"];
	activeMoveHeroId?: BattleHero["id"] | null;
	onResolveCard: (target: AnchorTarget) => void;
	onMoveHero: (target: GridPosition) => void;
	onSelectForMove: (heroId: BattleHero["id"] | null) => void;
	remainingMoves: number;
}

export function GridCell({
	cell,
	unitsInCell,
	isDanger,
	inRange,
	targeting,
	hasActiveAction,
	hoveredHeroId,
	onResolveCard,
	onMoveHero,
	onSelectForMove,
	activeMoveHeroId,
	remainingMoves,
}: GridCellProps) {
	const { currentVfx, setVfx, surfaces } = useBattleStore(
		useShallow((state) => ({
			currentVfx: state.currentVfx,
			setVfx: state.setVfx,
			surfaces: state.surfaces,
		})),
	);

	const hasUnitInCell = unitsInCell.length > 0;
	// In theory multiple units in cell is transient state when moving.
	const unitInCell = unitsInCell[0];
	const unitIsHero = unitInCell && isHero(unitInCell);
	const isHoveredHero = hoveredHeroId && unitInCell?.id === hoveredHeroId;
	const isMoving = !!activeMoveHeroId;

	const surface = surfaces[cell.id];

	// --- DYNAMIC CELL STYLING ---
	const baseClasses =
		"w-24 h-24 relative flex items-center justify-center transition-colors duration-300";
	let stateClasses =
		"bg-zinc-950/40 border border-zinc-800/60 z-0 backdrop-blur-[2px]";

	if (isHoveredHero) {
		stateClasses =
			"bg-blue-900/40 border-2 border-blue-400 z-10 shadow-[inset_0_0_15px_rgba(59,130,246,0.5)] backdrop-blur-none";
	} else if (targeting !== "none" && inRange) {
		switch (targeting) {
			case "cell":
			case "cell_or_enemy":
				stateClasses =
					"bg-blue-950/50 border border-blue-500/50 hover:bg-blue-900/60 z-10 cursor-pointer backdrop-blur-none";
				break;
			case "enemy":
				stateClasses =
					"bg-orange-900/50 border border-orange-500/50 hover:bg-orange-800/60 z-10 shadow-[inset_0_0_15px_rgba(249,115,22,0.2)] cursor-crosshair backdrop-blur-none";
				break;
			case "ally":
				stateClasses =
					"bg-green-900/50 border border-green-500/50 hover:bg-green-800/60 z-10 shadow-[inset_0_0_15px_rgba(34,197,94,0.2)] cursor-pointer backdrop-blur-none";
				break;
		}
	} else if (isDanger) {
		stateClasses =
			"bg-red-950/50 border border-red-600/70 shadow-[inset_0_0_15px_rgba(220,38,38,0.3)] z-10 backdrop-blur-none";
	}
	if (targeting === "invalid") {
		stateClasses += " cursor-not-allowed opacity-50";
	}

	const handleClick = () => {
		if (isMoving && targeting === "cell" && !hasUnitInCell && inRange) {
			onMoveHero(cell);
			return;
		}

		if (hasActiveAction && !isMoving && inRange) {
			onResolveCard(cell);
			return;
		}

		if (!hasActiveAction && unitIsHero && remainingMoves > 0) {
			if (activeMoveHeroId === unitInCell.id) {
				onSelectForMove(null);
			} else {
				onSelectForMove(unitInCell.id);
			}
		}
	};

	return (
		<button
			type="button"
			className={`${baseClasses} ${stateClasses} ${
				targeting !== "invalid" ? "hover:brightness-110" : ""
			}`}
			onClick={handleClick}
		>
			<span className="text-[10px] text-zinc-500 font-bold select-none absolute top-1 left-1 pointer-events-none">
				{cell.col},{cell.row}
			</span>

			{surface && (
				<div className="absolute inset-4 z-0 opacity-80 pointer-events-none flex items-center justify-center">
					<Image
						src={surface.spriteBase}
						alt={surface.type}
						fill
						className="rounded opacity-60 mix-blend-screen"
					/>
				</div>
			)}

			{unitsInCell.map((unit) => (
				<UnitSprite key={unit.id} unitInCell={unit} />
			))}

			<VfxOverlay
				type={currentVfx[cell.id]}
				onComplete={() => setVfx(cell.id, null)}
			/>
		</button>
	);
}
