import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import type { GridPosition } from "@/modules/battle/domain/grid.type";
import {
	calculateAttackableCells,
	calculateReachableCells,
	isTileEmpty,
	isTileOccupied,
} from "@/modules/battle/helpers/grid.helpers";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { Targeting } from "../components/GridCell"; // Adjust path if needed

export function useBattleGrid() {
	const store = useBattleStore(
		useShallow((state) => ({
			usedCardsThisTurn: state.usedCardsThisTurn,
			enemyAction: state.enemyAction,
			monsters: state.monsters,
			heroes: state.heroes,
			summons: state.summons,
			aiIntents: state.aiIntents,
			hoveredCard: state.hoveredCard,
			activeCard: state.activeCard,
			resolveCard: state.resolveCard,
			activeMoveUnitId: state.activeMoveUnitId,
			moveHero: state.moveHero,
			setActiveMoveHeroId: state.setActiveMoveHeroId,
			usedMovesThisTurn: state.usedMovesThisTurn,
		})),
	);

	// --- DANGER TILES ---
	const allDangerTiles = useMemo(
		() =>
			Object.values(store.aiIntents || {}).flatMap(
				(intent) => intent.dangerZone || [],
			),
		[store.aiIntents],
	);

	// --- ENEMY TURN TRIGGER ---
	const aliveHeroesCount = store.heroes.filter((h) => h.currentHp > 0).length;
	const isEnemyTurn =
		!store.activeCard &&
		aliveHeroesCount > 0 &&
		Object.keys(store.usedCardsThisTurn).length === aliveHeroesCount;

	useEffect(() => {
		if (isEnemyTurn) {
			const timeoutId = setTimeout(() => store.enemyAction(), 200);
			return () => clearTimeout(timeoutId);
		}
	}, [isEnemyTurn, store.enemyAction]);

	// --- RANGE & TARGETING CALCULATIONS ---
	let validTargetCells: GridPosition[] = [];
	let targeting: Targeting = "none";

	const cardToPreview = store.activeCard
		? store.activeCard.card
		: store.hoveredCard
			? store.hoveredCard.card
			: null;

	const previewCaster = store.activeCard
		? store.heroes.find((h) => h.id === store.activeCard?.unitId)
		: store.heroes.find((h) => h.id === store.hoveredCard?.heroId);

	const allObstacles = [...store.monsters, ...store.heroes, ...store.summons];
	const allyFaction = [
		...store.heroes,
		...store.summons.filter(({ allegiance }) => allegiance === "PLAYER"),
	];
	const enemyFaction = [
		...store.monsters,
		...store.summons.filter(({ allegiance }) => allegiance === "ENEMY"),
	];

	if (store.activeMoveUnitId) {
		const movingHero = store.heroes.find(
			(h) => h.id === store.activeMoveUnitId,
		);
		if (movingHero) {
			targeting = "cell";
			const remainingMove =
				movingHero.baseMove - (store.usedMovesThisTurn[movingHero.id] ?? 0);
			validTargetCells = calculateReachableCells(
				movingHero.gridPosition,
				remainingMove,
				enemyFaction,
				false,
			).filter(isTileEmpty(allObstacles));
		}
	} else if (cardToPreview && previewCaster) {
		const req = cardToPreview.playRequirement;
		if (req === "requires_enemy") targeting = "enemy";
		if (req === "requires_ally") targeting = "ally";
		if (req === "requires_empty_cell") targeting = "cell";
		if (req === "requires_empty_cell_or_enemy") targeting = "cell_or_enemy";

		if (targeting === "cell") {
			validTargetCells = calculateReachableCells(
				previewCaster.gridPosition,
				cardToPreview.range,
				allObstacles.filter((o) => o.id !== previewCaster.id),
			).filter(isTileEmpty(allObstacles));
		} else if (targeting === "cell_or_enemy") {
			validTargetCells = calculateReachableCells(
				previewCaster.gridPosition,
				cardToPreview.range,
				[previewCaster],
			);
		} else {
			const obstacles = targeting === "ally" ? allyFaction : enemyFaction;
			validTargetCells = calculateAttackableCells(
				previewCaster.gridPosition,
				cardToPreview.range,
				targeting === "ally",
			).filter(isTileOccupied<BattleUnit>(obstacles));
		}
	}

	return {
		store,
		allDangerTiles,
		validTargetCells,
		targeting,
	};
}
