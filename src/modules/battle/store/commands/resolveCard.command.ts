import type { AnchorTarget } from "@/modules/cards/domain/cards.type";
import {
	type BattleHero,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "../../domain/grid.type";
import { resolvers } from "../../helpers/effects/effect.resolvers";
import {
	filterGridByAttackPattern,
	getClosestOriginTile,
	getDistanceToBoundingBox,
	getLineOfSightPath,
	isUnitInTile,
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
			const distance = getDistanceToBoundingBox({
				caster: hero,
				target: { gridPosition: anchorTarget },
			});
			if (distance > card.range) {
				return;
			}
			const flightPath = getLineOfSightPath(hero.gridPosition, anchorTarget);

			for (let i = 1; i < flightPath.length; i++) {
				const tile = flightPath[i];
				const isOccupied = allUnits.some(
					(f) => f.currentHp > 0 && isUnitInTile(tile)(f),
				);

				if (isOccupied) {
					actualTarget = tile; // Detonate exactly on the tile we hit!
					break;
				}
			}
		}

		// --- 2. CALCULATE THE BLAST ZONE ---
		const attackOrigin = getClosestOriginTile({
			caster: hero,
			anchorTarget: actualTarget,
		});

		const patternCells: GridPosition[] = filterGridByAttackPattern({
			card,
			originPos: attackOrigin,
			targetPos: actualTarget,
		});

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
