import type { AnchorTarget } from "@/modules/cards/domain/cards.type";
import {
	type BattleHero,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "../../domain/grid.type";
import { getActualTarget } from "../../helpers/ai.move.helpers";
import { resolvers } from "../../helpers/effects/effect.resolvers";
import {
	getLineOfSightPath,
	getManhattanDistance,
	rotatePattern,
} from "../../helpers/grid.helpers";
import {
	calculateStateDiff,
	updateBattleUnitState,
} from "../../helpers/state.helpers";
import type { ActiveCardContext, StoreGet, StoreSet } from "../battle.store";
import { calculateAIIntents } from "./calculateAIIntents.command";

const updateHeroStance =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
	(heroId: BattleHero["id"]) =>
	(stance: UnitStance) => {
		const freshHero = [...get().heroes].find(({ id }) => id === heroId);
		if (!freshHero) return;
		updateBattleUnitState(get, set, isSimulation)({ ...freshHero, stance });
		return freshHero;
	};

export const resolveCard =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
	async (anchorTarget: AnchorTarget, cardContext: ActiveCardContext) => {
		const { heroes, monsters, summons } = get();

		const { unitId, card } = cardContext;
		const hero = heroes.find((h) => h.id === unitId);
		if (!hero) return;

		const allUnits = [...heroes, ...monsters, ...summons];
		let actualTarget = anchorTarget;

		// --- 1. CHECK RANGE ---
		if (anchorTarget) {
			const distance = getManhattanDistance(anchorTarget, hero.gridPosition);
			if (distance > card.range) {
				return;
			}
			actualTarget =
				getActualTarget(hero.gridPosition, anchorTarget, allUnits)
					?.gridPosition ?? actualTarget;
		}

		// --- 2. CALCULATE THE BLAST ZONE ---
		let patternCells: GridPosition[] = actualTarget ? [actualTarget] : [];
		if (card.aoePattern && actualTarget) {
			const rotatedPattern = rotatePattern(
				card.aoePattern,
				hero.gridPosition,
				actualTarget,
			);

			patternCells = rotatedPattern.map((p) => ({
				col: actualTarget.col + p.col,
				row: actualTarget.row + p.row,
			}));
		}

		const firePath = anchorTarget
			? getLineOfSightPath(hero.gridPosition, anchorTarget)
			: [];
		set((state) => ({
			...state,
			playerIntent: {
				figureId: hero.id,
				target: actualTarget,
				cardId: cardContext.card.id,
				intendedMove: firePath,
				dangerZone: patternCells,
			},
		}));

		// --- 3. RESOLVE EFFECTS WITH PATTERN ---
		for (const effect of card.effects) {
			await resolvers(effect)(get, set, isSimulation)({
				anchorTarget: actualTarget,
				caster: hero,
				patternCells,
			});
		}
		updateHeroStance(get, set, isSimulation)(unitId)(UnitStance.IDLE);

		const xpEarnedThisTurn = calculateStateDiff(
			get().monsters,
			monsters,
		).projectedCasualties.reduce(
			(xp, monsterId) =>
				xp + (monsters.find(({ id }) => id === monsterId)?.xpReward ?? 0),
			0,
		);
		// --- 4. CLEAN UP ---
		set(
			({
				heroes,
				monsters,
				summons,
				usedCardsThisTurn,
				usedMovesThisTurn,
				xpEarned,
				...prev
			}) => {
				const remainingMonsters = monsters.filter((m) => m.currentHp > 0);
				const remainingSummons = summons.filter((m) => m.currentHp > 0);
				return {
					...prev,
					activeHeroCard: null,
					monsters: remainingMonsters,
					summons: remainingSummons,
					usedCardsThisTurn: { ...usedCardsThisTurn, [hero.id]: card },
					usedMovesThisTurn: { ...usedMovesThisTurn, [hero.id]: 99 },
					xpEarned: xpEarned + xpEarnedThisTurn,
				};
			},
		);

		if (!isSimulation) {
			await calculateAIIntents(get, set)();
		}
	};
