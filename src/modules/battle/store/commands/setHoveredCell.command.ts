import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import type { GridPosition } from "../../domain/grid.type";
import { getSimulationState } from "../../helpers/simulation.helper";
import { calculateStateDiff } from "../../helpers/state.helpers";
import { resolveCard } from "./resolveCard.command";

export const setHoveredCell =
	(get: StoreGet, set: StoreSet) => async (cell: GridPosition | null) => {
		set(() => ({ hoveredCell: cell, playerIntent: null }));
		if (!cell) return;
		const { activeHeroCard, hoveredHeroCard, heroes, monsters, summons } =
			get();
		const cardContext = activeHeroCard || hoveredHeroCard;
		if (!cardContext) return;

		const { hoveredCell } = get();
		if (hoveredCell?.col !== cell.col || hoveredCell?.row !== cell.row) {
			return;
		}

		const { fakeGet, fakeSet } = getSimulationState(get);
		await resolveCard(fakeGet, fakeSet, true)(cell, cardContext);

		const shadowState = fakeGet();
		const shadowFigures = [
			...shadowState.heroes,
			...shadowState.monsters,
			...shadowState.summons,
		];
		const realFigures = [...heroes, ...monsters, ...summons];
		const { projectedMoves, projectedCasualties } = calculateStateDiff(
			shadowFigures,
			realFigures,
		);

		set(({ ...prev }) => ({
			...prev,
			playerIntent: {
				figureId: cardContext.unitId,
				cardId: cardContext.card.id,
				...shadowState.playerIntent,
				projectedMoves,
				projectedCasualties,
			},
		}));
	};
