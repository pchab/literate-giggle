import type { AnchorTarget } from "@/modules/cards/domain/cards.type";
import { UnitStance } from "@/modules/units/domain/units.type";
import { singleTargetPattern } from "../../data/attackPattern.data";
import type { GridPosition } from "../../domain/grid.type";
import { resolveTargets } from "../../helpers/effects/effect.helpers";
import { resolvers } from "../../helpers/effects/effect.resolvers";
import { finalizeAction } from "../../helpers/encounter.helpers";
import {
	filterGridByAttackPattern,
	getClosestOriginTile,
	getDistanceToBoundingBox,
	isUnitInTile,
} from "../../helpers/grid.helpers";
import { getLineOfSightPath } from "../../helpers/move.helpers";
import { updateUnitState } from "../../helpers/state.helpers";
import type { ActiveCardContext, BattleGet, BattleSet } from "../battle.store";
import { calculateAIIntents } from "./calculateAIIntents.command";

export const resolveCard =
	(get: BattleGet, set: BattleSet, isSimulation = false) =>
	async (anchorTarget: AnchorTarget, cardContext: ActiveCardContext) => {
		const { units: draftUnits, gridSize } = get();
		const { unitId, card } = cardContext;

		const hero = draftUnits.find((u) => u.id === unitId);
		if (!hero) return;

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
				const isOccupied = draftUnits.some(
					(f) => f.currentHp > 0 && isUnitInTile(tile)(f),
				);

				if (isOccupied) {
					actualTarget = { gridPosition: tile };
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
			pattern: card.aoePattern ?? singleTargetPattern,
			originPos: attackOrigin,
			targetPos: actualTarget,
			gridSize,
		});

		const firePath = anchorTarget
			? getLineOfSightPath(hero.gridPosition, anchorTarget.gridPosition)
			: [];

		set((state) => ({
			...state,
			playerIntent: {
				unitId: hero.id,
				target: actualTarget,
				cardId: card.id,
				intendedMove: firePath,
				dangerZone: patternCells,
			},
		}));

		// --- 3. PRE-RESOLVE TARGETS ---
		const lockedTargets = card.effects.map((effect) =>
			resolveTargets(
				effect.target,
				actualTarget,
				hero,
				draftUnits,
				patternCells,
			),
		);

		// --- 4. RESOLVE EFFECTS WITH PATTERN ---
		for (let i = 0; i < card.effects.length; i++) {
			const effect = card.effects[i];
			await resolvers(get, set, isSimulation)(effect)({
				anchorTarget: actualTarget,
				caster: hero,
				patternCells,
				targetIds: lockedTargets[i],
			});
		}

		await updateUnitState(
			get,
			set,
			isSimulation,
		)(hero.id, {
			stance: UnitStance.IDLE,
		});

		// --- 5. CLEAN UP & XP ---

		set(
			({ units, usedCardsThisTurn, usedMovesThisTurn, xpEarned, ...prev }) => {
				const survivingUnits = units.filter((u) => u.currentHp > 0);

				return {
					...prev,
					activeHeroCard: null,
					units: survivingUnits,
					usedCardsThisTurn: { ...usedCardsThisTurn, [hero.id]: card },
					usedMovesThisTurn: { ...usedMovesThisTurn, [hero.id]: 99 },
				};
			},
		);

		if (!isSimulation) {
			await calculateAIIntents(get, set)();
			await finalizeAction(get, set, draftUnits);
		}
	};
