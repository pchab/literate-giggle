import {
	calculateAttackableCells,
	filterGridByAttackPattern,
	getClosestOriginTile,
	getDistanceToBoundingBox,
	isTileEmpty,
	isTileInBounds,
} from "@/modules/battle/helpers/grid.helpers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import type { AnchorTarget, Card } from "@/modules/cards/domain/cards.type";
import {
	type AIBattleUnit,
	type BattleUnit,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import { isSummon } from "@/modules/figures/helpers/figures.helpers";
import { sleep } from "@/modules/shared/helpers/sleep";
import type { BoundingBox, GridPosition } from "../domain/grid.type";
import { getActualTarget, getIdealTarget } from "./ai.move.helpers";
import { resolvers } from "./effects/effect.resolvers";
import { calculateExactPath, moveBattleUnit } from "./move.helpers";
import { updateBattleUnitState } from "./state.helpers";

export type TargetResolver = <C extends AIBattleUnit>(
	aiFigure: C,
	card: Card,
	figures: BattleUnit[],
) => {
	reachableTarget: BoundingBox | null;
	moveDest: GridPosition | null;
	canHit: boolean;
};

export type AnchorResolver = ({
	attacker: { gridPosition },
	card,
	reachableTarget,
	obstacles,
}: {
	attacker: AIBattleUnit;
	card: Card;
	reachableTarget: BoundingBox;
	obstacles: BattleUnit[];
}) => AnchorTarget;

function getAnchorTarget<C extends BattleUnit, T extends BoundingBox>({
	attacker,
	card,
	reachableTarget,
	obstacles,
}: {
	attacker: C;
	card: Card;
	reachableTarget: T;
	obstacles: BattleUnit[];
}): AnchorTarget {
	const { gridPosition, size } = attacker;
	if (card.playRequirement === "no_target") {
		return { gridPosition, size };
	}

	if (card.playRequirement === "requires_empty_cell") {
		const possibleSpawns = calculateAttackableCells({
			attacker,
			rangeValue: card.range,
			canTargetSelf: false,
		})
			.filter(isTileInBounds)
			.filter(isTileEmpty(obstacles));

		if (possibleSpawns.length === 0) return null;
		const chosenSpawn =
			possibleSpawns[Math.floor(Math.random() * possibleSpawns.length)];
		return { gridPosition: chosenSpawn, size: 1 };
	}

	const actualTarget =
		getActualTarget({
			attacker,
			intendedTargetPos: reachableTarget.gridPosition,
			figures: obstacles,
		}) ?? reachableTarget;

	return {
		gridPosition: actualTarget.gridPosition,
		size: actualTarget.size ?? 1,
	};
}

const updateAIUnitStance =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
		(unitId: BattleUnit["id"], wait: number = isSimulation ? 0 : 300) =>
			async (stance: UnitStance) => {
				const freshAIUnit = [...get().monsters, ...get().summons].find(
					({ id }) => id === unitId,
				);
				if (!freshAIUnit) return;
				const newUnit = { ...freshAIUnit, stance }
				await sleep(wait);
				await updateBattleUnitState(
					get,
					set,
					isSimulation,
				)(newUnit);
				return newUnit;
			};

export const handleAICardIntent =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
		async ({
			attackerId,
			card,
			getTarget = getIdealTarget,
			getAnchor = getAnchorTarget,
		}: {
			attackerId: BattleUnit["id"];
			card: Card;
			getTarget?: TargetResolver;
			getAnchor?: AnchorResolver;
		}) => {
			const initialState = get();
			const initialAttacker = [
				...initialState.monsters,
				...initialState.summons,
			].find((m) => m.id === attackerId) as AIBattleUnit | undefined;

			if (!initialAttacker) return;

			const allFigures = [
				...initialState.heroes,
				...initialState.monsters,
				...initialState.summons,
			];
			const { reachableTarget, moveDest } = getTarget(
				initialAttacker,
				card,
				allFigures,
			);

			if (!reachableTarget || !moveDest) return;

			// ==========================================
			// 1. ANIMATE THE WALK
			// ==========================================
			const isNeutralSummon =
				isSummon(initialAttacker) && initialAttacker.allegiance === "NEUTRAL";
			const isAlly =
				isSummon(initialAttacker) && initialAttacker.allegiance === "PLAYER";
			const enemies = isNeutralSummon
				? allFigures
				: isAlly
					? [
						...initialState.monsters,
						...initialState.summons.filter((s) => s.allegiance !== "PLAYER"),
					]
					: [
						...initialState.heroes,
						...initialState.summons.filter((s) => s.allegiance !== "ENEMY"),
					];

			const path = calculateExactPath({
				movingUnit: initialAttacker,
				targetPos: moveDest,
				figures: enemies,
			});

			const movedUnit = await moveBattleUnit(
				get,
				set,
				isSimulation,
			)({
				movingUnit: initialAttacker,
				path,
			});

			// updated simulation results
			if (isSimulation) {
				set(({ aiIntents, ...prev }) => {
					const unitIntent = aiIntents[initialAttacker.id];
					if (unitIntent) {
						unitIntent.intendedMove = path;
					}
					return { aiIntents, ...prev };
				});
			}

			// ==========================================
			// 2. PREPARE THE ATTACK
			// ==========================================
			if (!movedUnit) {
				return;
			}

			const distanceToTarget = getDistanceToBoundingBox({
				caster: movedUnit,
				target: reachableTarget,
			});

			if (card.aiTargetPreference !== "self" && distanceToTarget > card.range) {
				return;
			}

			const anchorTarget = getAnchor({
				attacker: movedUnit,
				card,
				reachableTarget,
				obstacles: allFigures,
			});

			const attackOrigin = getClosestOriginTile({
				caster: movedUnit,
				anchorTarget,
			});

			const targetedCells = filterGridByAttackPattern({
				card,
				targetPos: anchorTarget,
				originPos: attackOrigin,
			});

			// updated simulation results
			if (isSimulation) {
				set(({ aiIntents, ...prev }) => {
					const unitIntent = aiIntents[initialAttacker.id];
					if (unitIntent) {
						unitIntent.dangerZone = targetedCells;
						unitIntent.target = anchorTarget;
					}
					return { aiIntents, ...prev };
				});
			}

			// ==========================================
			// 3. RESOLVE EFFECTS
			// ==========================================
			const changeStance = await updateAIUnitStance(
				get,
				set,
				isSimulation,
			)(attackerId);
			const attackingUnit = await changeStance(UnitStance.ATTACKING);
			if (!attackingUnit) return;

			for (const effect of card.effects) {
				await resolvers(effect)(get, set, isSimulation)({
					anchorTarget,
					caster: attackingUnit,
					patternCells: targetedCells,
				});
			}

			await changeStance(UnitStance.IDLE);
		};
