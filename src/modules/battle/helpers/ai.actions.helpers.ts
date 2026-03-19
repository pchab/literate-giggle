import {
	getManhattanDistance,
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
import {
	filterGridByAttackPattern,
	getActualTarget,
	getIdealTarget,
} from "./ai.move.helpers";
import { resolvers } from "./effects/effect.resolvers";
import { calculateExactPath, moveBattleUnit } from "./move.helpers";
import { updateBattleUnitState } from "./state.helpers";

function getAnchorTarget<C extends BattleUnit, T extends BattleUnit>({
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
	if (card.aiTargetPreference === "self") {
		return attacker.gridPosition;
	}

	if (card.aiTargetPreference === "empty_adjacent") {
		const possibleSpawns = [
			{
				col: attacker.gridPosition.col,
				row: attacker.gridPosition.row - 1,
			},
			{
				col: attacker.gridPosition.col - 1,
				row: attacker.gridPosition.row,
			},
			{
				col: attacker.gridPosition.col,
				row: attacker.gridPosition.row + 1,
			},
			{
				col: attacker.gridPosition.col + 1,
				row: attacker.gridPosition.row,
			},
		]
			.filter(isTileInBounds)
			.filter(isTileEmpty(obstacles));

		return possibleSpawns.length > 0 ? possibleSpawns[0] : null;
	}

	const actualTarget =
		getActualTarget(
			attacker.gridPosition,
			reachableTarget.gridPosition,
			obstacles,
		) ?? reachableTarget;
	return actualTarget.gridPosition;
}

const updateAIUnitStance =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
	(unitId: BattleUnit["id"], wait: number = 300) =>
	async (stance: UnitStance) => {
		const freshAIUnit = [...get().monsters, ...get().summons].find(
			({ id }) => id === unitId,
		);
		if (!freshAIUnit) return;
		await updateBattleUnitState(
			get,
			set,
			isSimulation,
		)({ ...freshAIUnit, stance });
		await sleep(wait);
		return freshAIUnit;
	};

export const handleAICardIntent =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
	async (attackerId: BattleUnit["id"], card: Card) => {
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
		const { reachableTarget, moveDest } = getIdealTarget(
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

		const path = calculateExactPath<BattleUnit>(
			initialAttacker.gridPosition,
			moveDest,
			enemies,
		);

		const movedUnit = await moveBattleUnit(
			get,
			set,
			isSimulation,
		)({
			movingUnit: initialAttacker,
			path,
			stepDelayMs: isSimulation ? 0 : 200,
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

		const distanceToTarget = getManhattanDistance(
			movedUnit.gridPosition,
			reachableTarget.gridPosition,
		);

		if (card.aiTargetPreference !== "self" && distanceToTarget > card.range) {
			return;
		}

		const anchorTarget = getAnchorTarget({
			attacker: movedUnit,
			card,
			reachableTarget,
			obstacles: allFigures,
		});

		const targetedCells = filterGridByAttackPattern(
			card,
			anchorTarget,
			movedUnit.gridPosition,
		);

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
		)(attackerId, isSimulation ? 0 : 300);
		const attackingUnit = await changeStance(UnitStance.ATTACKING);
		if (!attackingUnit) return;
		console.log("applying effects of card ", card.name);
		for (const effect of card.effects) {
			await resolvers(effect)(get, set, isSimulation)({
				anchorTarget,
				caster: attackingUnit,
				patternCells: targetedCells,
			});
		}
		await changeStance(UnitStance.IDLE);
	};
