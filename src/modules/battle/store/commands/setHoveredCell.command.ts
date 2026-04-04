import type { BattleGet, BattleSet } from "@/modules/battle/store/battle.store";
import type { GridPosition } from "../../domain/grid.type";
import { getSimulationState } from "../../helpers/simulation.helper";
import { calculateStateDiff } from "../../helpers/state.helpers";
import { resolveCard } from "./resolveCard.command";

export const setHoveredCell =
	(get: BattleGet, set: BattleSet) => async (cell: GridPosition | null) => {
		set(() => ({
			hoveredCell: cell,
			playerIntent: null,
			playerStateDiff: {
				projectedMoves: {},
				projectedCasualties: [],
				projectedDamage: {},
				projectedHealing: {},
			},
		}));
		if (!cell) return;

		const { activeHeroCard, hoveredHeroCard, units } = get();
		const cardContext = activeHeroCard || hoveredHeroCard;
		if (!cardContext) return;

		const anchorTarget = { gridPosition: cell, size: { cols: 1, rows: 1 } };

		const newPlayerIntent = {
			cardId: cardContext.card.id,
			unitId: cardContext.unitId,
			target: anchorTarget,
		};

		set(() => ({
			playerIntent: newPlayerIntent,
		}));

		// 2. Pre-simulation guard
		if (
			get().hoveredCell?.col !== cell.col ||
			get().hoveredCell?.row !== cell.row
		) {
			return;
		}

		// 3. Run the shadow simulation
		const { fakeGet, fakeSet } = getSimulationState(get);
		await resolveCard(fakeGet, fakeSet, true)(anchorTarget, cardContext);

		// 4. POST-SIMULATION GUARD (The Race Condition Fix)
		if (
			get().hoveredCell?.col !== cell.col ||
			get().hoveredCell?.row !== cell.row
		) {
			return;
		}

		// 5. Extract and commit diff
		const { units: shadowUnits, playerIntent: simulatedIntent } = fakeGet();
		const playerStateDiff = calculateStateDiff(shadowUnits, units);

		set((prev) => ({
			...prev,
			playerIntent: {
				...newPlayerIntent,
				...simulatedIntent,
			},
			playerStateDiff,
		}));
	};
