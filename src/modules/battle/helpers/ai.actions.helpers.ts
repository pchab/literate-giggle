import {
	getManhattanDistance,
	isTileInBounds,
	resolveSurfaceEffectAndReturnBreak,
} from "@/modules/battle/helpers/grid.helpers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import type {
	AIBattleUnit,
	BattleUnit,
} from "@/modules/figures/domain/figures.type";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";
import { sleep } from "@/modules/shared/helpers/sleep";
import {
	calculateExactPath,
	filterGridByAttackPattern,
	getActualTarget,
	getIdealTarget,
} from "./ai.move.helpers";
import {
	resolvePushEffect,
	resolveStandardEffect,
	resolveSummonEffect,
} from "./effect.resolvers";
import { updateAiBattleUnitState } from "./state.helpers";

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
				...initialState.summons.filter((s) => s.allegiance === "ENEMY"),
			]
		: [
				...initialState.heroes,
				...initialState.summons.filter((s) => s.allegiance === "PLAYER"),
			];

	const path = calculateExactPath<BattleUnit>(
		initialAttacker.gridPosition,
		moveDest,
		enemies,
	);

	for (const step of path) {
		const movingUnit = {
			...initialAttacker,
			gridPosition: step,
		};
		set(updateAiBattleUnitState(movingUnit));

		await sleep(250);

		const shouldBreak = resolveSurfaceEffectAndReturnBreak(get, set)(
			step,
			movingUnit,
		);
		if (shouldBreak) {
			break;
		}
	}

	// ==========================================
	// 2. PREPARE THE ATTACK
	// ==========================================
	const postMoveState = get();
	let draftHeroes = [...postMoveState.heroes];
	let draftMonsters = [...postMoveState.monsters];
	let draftSummons = [...postMoveState.summons];
	let draftVfx = { ...postMoveState.currentVfx };

	const freshAttacker = [...draftMonsters, ...draftSummons].find(
		(m) => m.id === attackerId,
	) as AIBattleUnit | undefined;
	if (!freshAttacker) return;

	if (freshAttacker.currentHp < 1) {
		return;
	}

	const distanceToTarget = getManhattanDistance(
		freshAttacker.gridPosition,
		reachableTarget.gridPosition,
	);

	if (card.aiTargetPreference !== "self" && distanceToTarget > card.range) {
		return;
	}

	const collision = getActualTarget(
		freshAttacker.gridPosition,
		reachableTarget.gridPosition,
		[...draftHeroes, ...draftMonsters, ...draftSummons],
	);
	const finalTargetPos = collision
		? collision.gridPosition
		: reachableTarget.gridPosition;

	const targetedCells = filterGridByAttackPattern(
		card,
		finalTargetPos,
		freshAttacker.gridPosition,
	);
	const anchorTargetId: BattleUnit["id"] = collision
		? collision.id
		: reachableTarget.id;

	// ==========================================
	// 3. RESOLVE EFFECTS
	// ==========================================
	for (const effect of card.effects) {
		if (
			effect.type === "damage" ||
			effect.type === "heal" ||
			effect.type === "apply_status"
		) {
			const result = resolveStandardEffect({
				effect,
				anchorTargetId,
				caster: freshAttacker, // Use the new position!
				figures: [...draftHeroes, ...draftMonsters, ...draftSummons],
				vfx: draftVfx,
				patternCells: targetedCells,
			});
			draftHeroes = result.figures.filter(isHero);
			draftMonsters = result.figures.filter(isMonster);
			draftSummons = result.figures.filter(isSummon);
			draftVfx = result.vfx;
		}

		if (effect.type === "summon") {
			const possibleSpawns = [
				{
					col: freshAttacker.gridPosition.col,
					row: freshAttacker.gridPosition.row - 1,
				},
				{
					col: freshAttacker.gridPosition.col - 1,
					row: freshAttacker.gridPosition.row,
				},
				{
					col: freshAttacker.gridPosition.col,
					row: freshAttacker.gridPosition.row + 1,
				},
				{
					col: freshAttacker.gridPosition.col + 1,
					row: freshAttacker.gridPosition.row,
				},
			]
				.filter(isTileInBounds)
				.filter(
					(pos) =>
						![...draftHeroes, ...draftMonsters, ...draftSummons].some(
							({ gridPosition }) =>
								gridPosition.col === pos.col && gridPosition.row === pos.row,
						),
				);
			const spawnPos = possibleSpawns.length > 0 ? possibleSpawns[0] : null;
			if (spawnPos) {
				draftSummons = resolveSummonEffect({
					effect,
					anchorTargetId: spawnPos,
					caster: freshAttacker,
					figures: draftSummons,
					vfx: draftVfx,
				}).figures;
			}
		}

		if (effect.type === "push") {
			const result = resolvePushEffect({
				effect,
				anchorTargetId,
				caster: freshAttacker,
				figures: [...draftHeroes, ...draftMonsters, ...draftSummons],
				vfx: draftVfx,
			});
			draftHeroes = result.figures.filter(isHero);
			draftMonsters = result.figures.filter(isMonster);
			draftSummons = result.figures.filter(isSummon);
			draftVfx = result.vfx;
		}
	}

	// ==========================================
	// 4. COMMIT ATTACK
	// ==========================================
	set((prev) => ({
		...prev,
		heroes: draftHeroes,
		monsters: draftMonsters,
		summons: draftSummons,
		currentVfx: draftVfx,
	}));

	await sleep(300);
}
