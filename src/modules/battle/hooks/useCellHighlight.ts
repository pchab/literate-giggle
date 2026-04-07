import type { GridPosition } from "@/modules/battle/domain/grid.type";
import {
	isTileEmpty,
	isUnitInTile,
} from "@/modules/battle/helpers/grid.helpers";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import { isHero } from "@/modules/units/helpers/units.helpers";
import { useShallow } from "zustand/shallow";
import type { Intent } from "../domain/intent.type";
import { areEnemies } from "../helpers/effects/effect.helpers";
import {
	calculateAttackableCells,
	calculateReachableCells,
} from "../helpers/move.helpers";

type CellHighlight = {
	activeUnit?: BattleUnit["id"];
	moveCells: GridPosition[];
	allyTargets: GridPosition[];
	enemyTargets: GridPosition[];
	cellTargets: GridPosition[];
};

export function useCellHighlight(): CellHighlight {
	const {
		gridSize,
		units,
		aiIntents,
		activeHeroCard,
		hoveredHeroCard,
		activeMoveHeroId,
		hoveredCell,
		playerIntent,
		usedMovesThisTurn,
	} = useBattleStore(
		useShallow((state) => ({
			gridSize: state.gridSize,
			units: state.units,
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
	};

	const heroes = units.filter(isHero);

	if (hoveredCell) {
		const hoveredHeroUnit = heroes.find(isUnitInTile(hoveredCell));
		if (hoveredHeroUnit) {
			highlight.activeUnit = hoveredHeroUnit.id;
		}
	}

	// ==========================================
	// CASE 1: HERO MOVING
	// ==========================================
	if (activeMoveHeroId) {
		const hero = heroes.find(({ id }) => id === activeMoveHeroId);
		if (!hero) return highlight;

		const remainingMove = hero.baseMove - (usedMovesThisTurn[hero.id] ?? 0);
		const oppositeFaction = units.filter(areEnemies(hero));

		const validTargetCells = calculateReachableCells({
			movingUnit: { ...hero, baseMove: remainingMove },
			blockingUnits: oppositeFaction,
			canTargetSelf: false,
			gridSize,
		}).filter(isTileEmpty(units));

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
	const cardContext = activeHeroCard || hoveredHeroCard;

	if (cardContext) {
		intent = playerIntent;
		card = cardContext.card;
		const hero = heroes.find((h) => h.id === cardContext.unitId);

		if (!intent && hero) {
			const { playRequirement, range } = card;
			let dangerZone: GridPosition[] = calculateAttackableCells({
				attacker: hero,
				rangeValue: range,
				canTargetSelf: false,
				gridSize,
			});

			if (playRequirement === "requires_empty_cell") {
				dangerZone = dangerZone.filter(isTileEmpty(units));
			} else {
				let targets: BattleUnit[] = [];

				if (playRequirement === "requires_ally") {
					targets = units.filter((unit) => !areEnemies(hero)(unit));
				} else if (playRequirement === "requires_enemy") {
					targets = units.filter(areEnemies(hero));
				} else if (playRequirement === "requires_entity") {
					targets = units;
				}

				dangerZone = dangerZone.filter((cell) =>
					targets.some(isUnitInTile(cell)),
				);
			}
			intent = { unitId: hero.id, cardId: card.id, dangerZone };
		}
	} else {
		// ==========================================
		// CASE 3: HIGHLIGHT CELLS FOR AI ACTION
		// ==========================================
		if (hoveredCell) {
			const hoveredAiUnit = units
				.filter((u) => !isHero(u))
				.find(isUnitInTile(hoveredCell));

			if (!hoveredAiUnit) return highlight;

			intent = aiIntents[hoveredAiUnit.id];
			card = intent && useRegistryStore.getState().getCard(intent.cardId);
		}
	}

	// ==========================================
	// RETURN FORMATTED HIGHLIGHTS
	// ==========================================
	if (!intent || !card) return highlight;

	const { playRequirement } = card;

	return {
		...highlight,
		activeUnit: intent.unitId,
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
	};
}
