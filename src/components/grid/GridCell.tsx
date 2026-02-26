import type { AnchorTarget } from "@/modules/cards/domain/cards.type";
import type {
	Hero,
	Monster,
	Summon,
} from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "@/modules/grid/grid.type";
import EnemySprite from "../units/EnemySprite";
import HeroSprite from "../units/HeroSprite";
import SummonSprite from "../units/SummonSprite";

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
	const isCellEmpty = !enemyInCell && !heroInCell && !summonInCell;
	const isHoveredHero = hoveredHeroId && heroInCell?.id === hoveredHeroId;

	// --- DYNAMIC CELL STYLING ---
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
		// A. Executing a Move
		if (isMoving && isTargetingEmpty && isCellEmpty && inRange) {
			onMoveHero(cell);
			return;
		}

		// B. Executing a Card
		if (hasActiveAction && !isMoving && inRange) {
			if (isTargetingEmpty && isCellEmpty) onResolveCard(cell);
			else if (isTargetingEnemy && enemyInCell) onResolveCard(enemyInCell.id);
			else if (isTargetingAlly && heroInCell) onResolveCard(heroInCell.id);
			else if (canTargetSelf && heroInCell && heroInCell.id === previewCasterId)
				onResolveCard(heroInCell.id);
			return;
		}

		// C. [NEW] Selecting a Hero for Movement
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
			className={`${baseClasses} ${stateClasses} ${heroInCell && !isInvalidTarget ? "hover:brightness-110" : ""}`}
			onClick={handleClick}
		>
			<span className="text-xs text-zinc-800 select-none absolute top-1 left-1">
				{cell.col},{cell.row}
			</span>
			{enemyInCell && <EnemySprite unitInCell={enemyInCell} />}
			{summonInCell && <SummonSprite unitInCell={summonInCell} />}
			{heroInCell && <HeroSprite unitInCell={heroInCell} />}
		</button>
	);
}
