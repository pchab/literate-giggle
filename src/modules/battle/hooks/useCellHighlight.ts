import { useShallow } from "zustand/shallow";
import type { GridPosition } from "@/modules/battle/domain/grid.type";
import {
	calculateReachableCells,
	isTileEmpty,
	isUnitInTile,
} from "@/modules/battle/helpers/grid.helpers";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import { cardLibrary } from "@/modules/cards/data/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { Intent } from "../domain/intent.type";
import { areEnemies } from "../helpers/effects/effect.helpers";

export type CellHighlight = {
	activeUnit?: BattleUnit["id"];
	moveCells: GridPosition[];
	allyTargets: GridPosition[];
	enemyTargets: GridPosition[];
	cellTargets: GridPosition[];
	projectedMoves: Record<BattleUnit["id"], GridPosition>;
	projectedCasualties: string[];
};

export function useCellHighlight(): CellHighlight {
	const {
		heroes,
		monsters,
		summons,
		aiIntents,
		usedCardsThisTurn,
		activeHeroCard,
		hoveredHeroCard,
		activeMoveHeroId,
		hoveredCell,
		enemyAction,
		playerIntent,
		...store
	} = useBattleStore(
		useShallow((state) => ({
			usedCardsThisTurn: state.usedCardsThisTurn,
			enemyAction: state.enemyAction,
			monsters: state.monsters,
			heroes: state.heroes,
			summons: state.summons,
			aiIntents: state.aiIntents,
			activeHeroCard: state.activeHeroCard,
			hoveredHeroCard: state.hoveredHeroCard,
			hoveredCell: state.hoveredCell,
			activeMoveHeroId: state.activeMoveHeroId,
			usedMovesThisTurn: state.usedMovesThisTurn,
			playerIntent: state.playerIntent,
		})),
	);

	const highlight: CellHighlight = {
		moveCells: [],
		allyTargets: [],
		enemyTargets: [],
		cellTargets: [],
		projectedMoves: {},
		projectedCasualties: [],
	};

	if (hoveredCell) {
		const hoveredHeroUnit = heroes.find(isUnitInTile(hoveredCell));
		if (hoveredHeroUnit) {
			highlight.activeUnit = hoveredHeroUnit.id;
		}
	}

	const allUnits = [...heroes, ...monsters, ...summons];

	// ==========================================
	// CASE 1: HERO MOVING
	// ==========================================
	if (activeMoveHeroId) {
		const hero = heroes.find(({ id }) => id === activeMoveHeroId);
		if (!hero) return highlight;

		const remainingMove =
			hero.baseMove - (store.usedMovesThisTurn[hero.id] ?? 0);
		const oppositeFaction = allUnits.filter(areEnemies(hero));
		const validTargetCells = calculateReachableCells(
			hero.gridPosition,
			remainingMove,
			oppositeFaction,
			false,
		).filter(isTileEmpty(oppositeFaction));

		return {
			...highlight,
			activeUnit: hero.id,
			moveCells: validTargetCells,
		};
	}

	let intent: Intent | null = null;
	let card: Card | undefined;
	// ==========================================
	// CASE 2: HERO USING CARD
	// ==========================================
	if (activeHeroCard || hoveredHeroCard) {
		intent = playerIntent;
		card = activeHeroCard?.card ?? hoveredHeroCard?.card;
	} else {
		// ==========================================
		// CASE 3: HIGHLIGHT CELLS FOR ENEMY ACTION
		// ==========================================
		if (hoveredCell) {
			const hoveredAiUnit = [...monsters, ...summons].find(
				isUnitInTile(hoveredCell),
			);
			if (!hoveredAiUnit) return highlight;

			intent = aiIntents[hoveredAiUnit.id];
			card = intent && cardLibrary[intent.cardId];
		}
	}

	if (!intent || !card) return highlight;
	const { playRequirement } = card;

	return {
		...highlight,
		activeUnit: intent.figureId,
		moveCells: intent.intendedMove ?? [],
		allyTargets:
			playRequirement === "requires_ally" ? (intent.dangerZone ?? []) : [],
		enemyTargets:
			playRequirement === "requires_enemy" ? (intent.dangerZone ?? []) : [],
		cellTargets:
			playRequirement === "requires_empty_cell" ||
			playRequirement === "requires_entity"
				? (intent.dangerZone ?? [])
				: [],
		projectedMoves: intent.projectedMoves ?? {},
		projectedCasualties: intent.projectedCasualties ?? [],
	};
}
