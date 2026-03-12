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

	const collision = getActualTarget(
		attacker.gridPosition,
		reachableTarget.gridPosition,
		obstacles,
	);

	const { gridPosition: anchorTarget } = collision
		? collision
		: reachableTarget;

	return anchorTarget;
}

export async function handleAICardIntent(
	get: StoreGet,
	set: StoreSet,
	attackerId: BattleUnit["id"],
	card: Card,
) {
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
	const isAlly =
		isSummon(initialAttacker) && initialAttacker.allegiance === "PLAYER";
	const enemies = isAlly
		? [
				...initialState.monsters,
				...initialState.summons.filter((s) =>
					["ENEMY", "NEUTRAL"].includes(s.allegiance),
				),
			]
		: [
				...initialState.heroes,
				...initialState.summons.filter((s) =>
					["PLAYER", "NEUTRAL"].includes(s.allegiance),
				),
			];

	const path = calculateExactPath<BattleUnit>(
		initialAttacker.gridPosition,
		moveDest,
		enemies,
	);

	const movingUnit = { ...initialAttacker, stance: UnitStance.MOVING };
	updateBattleUnitState(set)(movingUnit);
	const movedUnit = await moveBattleUnit(
		get,
		set,
	)({
		movingUnit,
		path,
	});

	// ==========================================
	// 2. PREPARE THE ATTACK
	// ==========================================
	if (!movedUnit || movedUnit.currentHp < 1) {
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

	// ==========================================
	// 3. RESOLVE EFFECTS
	// ==========================================
	const attackingUnit = { ...movedUnit, stance: UnitStance.ATTACKING };
	updateBattleUnitState(set)(attackingUnit);
	await sleep(300);
	for (const effect of card.effects) {
		await resolvers(effect)(get, set)({
			anchorTarget,
			caster: attackingUnit,
			patternCells: targetedCells,
		});
	}
	const stillUnit = { ...attackingUnit, stance: UnitStance.IDLE };
	updateBattleUnitState(set)(stillUnit);

	await sleep(300);
}
