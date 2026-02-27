"use client";

import { useShallow } from "zustand/shallow";
import type { AnchorTarget } from "@/modules/cards/domain/cards.type";
import type {
	Hero,
	Monster,
	Summon,
} from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "@/modules/grid/grid.type";
import { useBattleStore } from "@/store/battle.store";
import EnemySprite from "../units/EnemySprite";
import HeroSprite from "../units/HeroSprite";
import SummonSprite from "../units/SummonSprite";
import { VfxOverlay } from "./VfxOverlay";

interface GridCellProps {
	cell: { id: string } & GridPosition;
	enemyInCell?: Monster;
	heroInCell?: Hero;
	summonInCell?: Summon;
	isDanger: boolean;
	inRange: boolean;
	isTargetingEmpty: boolean;
	isTargetingEnemy: boolean;
	isTargetingAlly: boolean;
	isMoving: boolean;
	canTargetSelf: boolean;
	hasActiveAction: boolean;
	previewCasterId?: Hero["id"];
	hoveredHeroId?: Hero["id"];
	onResolveCard: (target: AnchorTarget | null) => void;
	onMoveHero: (target: GridPosition) => void;
	onSelectForMove: (heroId: Hero["id"] | null) => void;
	activeMoveHeroId?: Hero["id"] | null;
	hasMoved: boolean;
}

export function GridCell({
	cell,
	enemyInCell,
	heroInCell,
	summonInCell,
	isDanger,
	inRange,
	isTargetingEmpty,
	isTargetingEnemy,
	isTargetingAlly,
	isMoving,
	canTargetSelf,
	hasActiveAction,
	previewCasterId,
	hoveredHeroId,
	onResolveCard,
	onMoveHero,
	onSelectForMove,
	activeMoveHeroId,
	hasMoved,
}: GridCellProps) {
	const { currentVfx, setVfx } = useBattleStore(
		useShallow((state) => ({
			currentVfx: state.currentVfx,
			setVfx: state.setVfx,
		})),
	);
	const isCellEmpty = !enemyInCell && !heroInCell && !summonInCell;
	const isHoveredHero = hoveredHeroId && heroInCell?.id === hoveredHeroId;

	// --- DYNAMIC CELL STYLING ---
	// Notice we use highly transparent backgrounds (/30, /40) so the parent terrain shows through
	const baseClasses =
		"w-24 h-24 relative flex items-center justify-center transition-colors duration-300";
	let stateClasses =
		"bg-zinc-950/40 border border-zinc-800/60 z-0 backdrop-blur-[2px]";

	if (isHoveredHero) {
		stateClasses =
			"bg-blue-900/40 border-2 border-blue-400 z-10 shadow-[inset_0_0_15px_rgba(59,130,246,0.5)] backdrop-blur-none";
	} else if (isDanger) {
		stateClasses =
			"bg-red-950/50 border border-red-600/70 shadow-[inset_0_0_15px_rgba(220,38,38,0.3)] z-10 backdrop-blur-none";
	} else if (inRange) {
		if (isTargetingEmpty && isCellEmpty) {
			stateClasses =
				"bg-blue-950/50 border border-blue-500/50 hover:bg-blue-900/60 z-10 cursor-pointer backdrop-blur-none";
		} else if (isTargetingEnemy && enemyInCell) {
			stateClasses =
				"bg-orange-900/50 border border-orange-500/50 hover:bg-orange-800/60 z-10 shadow-[inset_0_0_15px_rgba(249,115,22,0.2)] cursor-crosshair backdrop-blur-none";
		} else if (isTargetingAlly && heroInCell) {
			stateClasses =
				"bg-green-900/50 border border-green-500/50 hover:bg-green-800/60 z-10 shadow-[inset_0_0_15px_rgba(34,197,94,0.2)] cursor-pointer backdrop-blur-none";
		}
	}

	const isInvalidTarget =
		hasActiveAction &&
		(!inRange ||
			(isTargetingEmpty && !isCellEmpty) ||
			(isTargetingEnemy && !enemyInCell) ||
			(isTargetingAlly && !heroInCell));

	if (isInvalidTarget && !canTargetSelf && heroInCell?.id !== previewCasterId) {
		stateClasses += " cursor-not-allowed opacity-50";
	}

	// --- CLICK HANDLER ---
	const handleClick = () => {
		if (isMoving && isTargetingEmpty && isCellEmpty && inRange) {
			onMoveHero(cell);
			return;
		}

		if (hasActiveAction && !isMoving && inRange) {
			if (isTargetingEmpty && isCellEmpty) onResolveCard(cell);
			else if (isTargetingEnemy && enemyInCell) onResolveCard(enemyInCell.id);
			else if (isTargetingAlly && heroInCell) onResolveCard(heroInCell.id);
			else if (canTargetSelf && heroInCell && heroInCell.id === previewCasterId)
				onResolveCard(heroInCell.id);
			return;
		}

		if (!hasActiveAction && heroInCell && !hasMoved) {
			if (activeMoveHeroId === heroInCell.id) {
				onSelectForMove(null);
			} else {
				onSelectForMove(heroInCell.id);
			}
		}
	};

	return (
		<button
			type="button"
			className={`${baseClasses} ${stateClasses} ${
				heroInCell && !isInvalidTarget ? "hover:brightness-110" : ""
			}`}
			onClick={handleClick}
		>
			<span className="text-[10px] text-zinc-500 font-bold select-none absolute top-1 left-1 pointer-events-none">
				{cell.col},{cell.row}
			</span>

			{enemyInCell && <EnemySprite unitInCell={enemyInCell} />}

			{summonInCell && <SummonSprite unitInCell={summonInCell} />}

			{heroInCell && <HeroSprite unitInCell={heroInCell} />}

			<VfxOverlay
				type={currentVfx[cell.id]}
				onComplete={() => setVfx(cell.id, null)}
			/>
		</button>
	);
}
