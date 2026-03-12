import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import type { GridPosition } from "@/modules/battle/domain/grid.type";
import {
	calculateAttackableCells,
	calculateReachableCells,
	isTileEmpty,
	isTileOccupied,
} from "@/modules/battle/helpers/grid.helpers";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import { cardLibrary } from "@/modules/cards/data/cards.data";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { isHeroId } from "@/modules/figures/helpers/figures.helpers";
import { areEnemies } from "../helpers/effects/effect.helpers";
import { calculateExactPath } from "../helpers/move.helpers";

export type CellHighlight = {
	activeUnit?: BattleUnit["id"];
	moveCells?: GridPosition[];
	allyTargets?: GridPosition[];
	enemyTargets?: GridPosition[];
	cellTargets?: GridPosition[];
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
		hoveredUnitId,
		enemyAction,
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
			resolveCard: state.resolveCard,
			hoveredUnitId: state.hoveredUnitId,
			activeMoveHeroId: state.activeMoveHeroId,
			moveHero: state.moveHero,
			setActiveMoveHeroId: state.setActiveMoveHeroId,
			usedMovesThisTurn: state.usedMovesThisTurn,
		})),
	);

	// --- ENEMY TURN TRIGGER ---
	const aliveHeroesCount = heroes.filter((h) => h.currentHp > 0).length;
	const isEnemyTurn =
		!activeHeroCard &&
		aliveHeroesCount > 0 &&
		Object.keys(usedCardsThisTurn).length === aliveHeroesCount;

	useEffect(() => {
		if (isEnemyTurn) {
			const timeoutId = setTimeout(() => enemyAction(), 200);
			return () => clearTimeout(timeoutId);
		}
	}, [isEnemyTurn, enemyAction]);

	const allUnits = [...heroes, ...monsters, ...summons];

	// --- HIGHLIGHT CELLS FOR HERO ACTION ---
	// ----- CASE 1: HERO MOVING -----
	if (activeMoveHeroId) {
		const hero = heroes.find(({ id }) => id === activeMoveHeroId);
		if (!hero) {
			return {};
		}

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
			activeUnit: hero.id,
			moveCells: validTargetCells,
		};
	}

	// ----- CASE 2: HERO USING CARD -----
	if (activeHeroCard || hoveredHeroCard) {
		const { unitId, card } = activeHeroCard ?? hoveredHeroCard ?? {};
		const hero = heroes.find(({ id }) => id === unitId);
		if (!hero || !card) {
			return {};
		}

		const allyFaction = [
			...heroes,
			...summons.filter(({ allegiance }) => allegiance === "PLAYER"),
		];
		const enemyFaction = [
			...monsters,
			...summons.filter(({ allegiance }) => allegiance === "ENEMY"),
		];
		const cellHighlight: CellHighlight = {
			activeUnit: hero.id,
			moveCells: [],
			allyTargets: [],
			enemyTargets: [],
			cellTargets: [],
		};

		const { playRequirement } = card;

		if (
			playRequirement === "requires_enemy" ||
			playRequirement === "requires_empty_cell_or_enemy"
		) {
			cellHighlight.enemyTargets = calculateAttackableCells(
				hero.gridPosition,
				card.range,
				false,
			).filter(isTileOccupied(enemyFaction));
		}

		if (playRequirement === "requires_ally") {
			cellHighlight.allyTargets = calculateAttackableCells(
				hero.gridPosition,
				card.range,
				true,
			).filter(isTileOccupied(allyFaction));
		}

		if (playRequirement === "requires_empty_cell") {
			cellHighlight.cellTargets = calculateAttackableCells(
				hero.gridPosition,
				card.range,
				false,
			).filter(isTileEmpty(allUnits));
		}

		if (playRequirement === "requires_empty_cell_or_enemy") {
			cellHighlight.cellTargets = calculateAttackableCells(
				hero.gridPosition,
				card.range,
				false,
			).filter(isTileEmpty(allyFaction));
		}

		return cellHighlight;
	}

	// --- HIGHLIGHT CELLS FOR ENEMY ACTION ---
	if (hoveredUnitId && !isHeroId(hoveredUnitId)) {
		const AIUnit = [...monsters, ...summons].find(
			({ id }) => id === hoveredUnitId,
		);
		const AIIntent = aiIntents[hoveredUnitId];
		if (!AIUnit || !AIIntent) {
			return {};
		}

		const oppositeFaction = [
			...heroes,
			...summons.filter(({ allegiance }) => allegiance !== "ENEMY"),
		];
		const { playRequirement } = cardLibrary[AIIntent.cardId];

		return {
			activeUnit: AIUnit.id,
			moveCells: calculateExactPath(
				AIUnit.gridPosition,
				AIIntent.intendedMove,
				oppositeFaction,
			),
			allyTargets:
				playRequirement === "requires_ally" ? AIIntent.dangerZone : [],
			enemyTargets:
				playRequirement === "requires_enemy" ? AIIntent.dangerZone : [],
			cellTargets: [
				"requires_empty_cell",
				"requires_empty_cell_or_enemy",
			].includes(playRequirement)
				? AIIntent.dangerZone
				: [],
		};
	}

	return {};
}
