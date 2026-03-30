import type { AnchorTarget } from "@/modules/cards/domain/cards.type";
import { UnitStance } from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "../../domain/grid.type";
import { resolveTargets } from "../../helpers/effects/effect.helpers";
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
	updateUnitState,
} from "../../helpers/state.helpers";
import type { ActiveCardContext, StoreGet, StoreSet } from "../battle.store";
import { calculateAIIntents } from "./calculateAIIntents.command";

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
				target: anchorTarget,
			});
			if (distance > card.range) {
				return;
			}
			const flightPath = getLineOfSightPath(
				hero.gridPosition,
				anchorTarget.gridPosition,
			);

			for (let i = 1; i < flightPath.length; i++) {
				const tile = flightPath[i];
				const isOccupied = allUnits.some(
					(f) => f.currentHp > 0 && isUnitInTile(tile)(f),
				);

				if (isOccupied) {
					actualTarget = { gridPosition: tile }; // Detonate exactly on the tile we hit!
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
			? getLineOfSightPath(hero.gridPosition, anchorTarget.gridPosition)
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

		// --- 3. PRE-RESOLVE TARGETS ---
		const lockedTargets = card.effects.map((effect) =>
			resolveTargets(effect.target, anchorTarget, hero, allUnits, patternCells),
		);

		// --- 4. RESOLVE EFFECTS WITH PATTERN ---
		for (let i = 0; i < card.effects.length; i++) {
			const effect = card.effects[i];
			await resolvers(effect)(get, set, isSimulation)({
				anchorTarget: actualTarget,
				caster: hero,
				patternCells,
				targetIds: lockedTargets[i],
			});
		}
		updateUnitState(
			get,
			set,
			isSimulation,
		)(unitId, { stance: UnitStance.IDLE });

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
