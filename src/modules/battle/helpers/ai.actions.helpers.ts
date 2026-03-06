import {
	getManhattanDistance,
	isTileInBounds,
} from "@/modules/battle/helpers/grid.helpers";
import type { BattleState } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Monster } from "@/modules/figures/domain/figures.type";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";
import {
	filterGridByAttackPattern,
	getActualTarget,
	getIdealTarget,
} from "./ai.move.helpers";
import {
	resolvePushEffect,
	resolveStandardEffect,
	resolveSummonEffect,
} from "./effect.resolvers";

export function handleCardIntent(
	state: BattleState,
	attacker: Monster,
	card: Card,
) {
	const { reachableTarget, moveDest } = getIdealTarget(
		attacker,
		card,
		[...state.heroes, ...state.summons.filter((s) => s.allegiance === "PLAYER")],
		[...state.monsters, ...state.summons.filter((s) => s.allegiance === "ENEMY")],
	);

	if (!reachableTarget || !moveDest) return null;

	// 1. Resolve Movement
	let draftMonsters = state.monsters.map((m) =>
		m.id === attacker.id ? { ...m, gridPosition: moveDest } : m,
	);
	let draftHeroes = [...state.heroes];
	let draftSummons = [...state.summons];
	let draftVfx = { ...state.currentVfx };

	const distanceToTarget = getManhattanDistance(
		moveDest,
		reachableTarget.gridPosition,
	);

	if (card.aiTargetPreference !== "self" && distanceToTarget > card.range) {
		return {
			nextMonsters: draftMonsters,
			nextHeroes: draftHeroes,
			nextSummons: draftSummons,
			nextVfx: draftVfx,
		};
	}

	// 2. Find spatial targets
	const collision = getActualTarget(moveDest, reachableTarget.gridPosition, [
		...draftHeroes,
		...draftMonsters,
		...draftSummons,
	]);
	const finalTargetPos = collision
		? collision.gridPosition
		: reachableTarget.gridPosition;

	// This is the array of GridPositions the AoE hits!
	const targetedCells = filterGridByAttackPattern(card, finalTargetPos);
	// The primary target is the anchor (used if an effect is target: "anchor")
	const anchorTargetId = collision ? collision.id : reachableTarget.id;

	// 3. PIpe everything through your unified resolvers!
	for (const effect of card.effects) {
		if (
			effect.type === "damage" ||
			effect.type === "heal" ||
			effect.type === "block"
		) {
			const result = resolveStandardEffect({
				effect,
				anchorTargetId,
				caster: attacker,
				figures: [...draftHeroes, ...draftMonsters, ...draftSummons],
				vfx: draftVfx,
				patternCells: targetedCells,
			});
			draftHeroes = result.figures.filter((f) => isHero(f));
			draftMonsters = result.figures.filter((f) => isMonster(f));
			draftSummons = result.figures.filter((f) => isSummon(f));
			draftVfx = result.vfx;
		}

		if (effect.type === "summon") {
			const possibleSpawns = [
				{ col: attacker.gridPosition.col, row: attacker.gridPosition.row - 1 },
				{ col: attacker.gridPosition.col - 1, row: attacker.gridPosition.row },
				{ col: attacker.gridPosition.col, row: attacker.gridPosition.row + 1 },
				{ col: attacker.gridPosition.col + 1, row: attacker.gridPosition.row },
			].filter(isTileInBounds)
				.filter(
					(pos) =>
						![...draftHeroes, ...draftMonsters, ...draftSummons].some(
							(f) =>
								f.gridPosition.col === pos.col &&
								f.gridPosition.row === pos.row,
						),
				);
			const spawnPos = possibleSpawns.length > 0 ? possibleSpawns[0] : null;
			if (spawnPos) {
				draftSummons = resolveSummonEffect({
					effect,
					anchorTargetId: spawnPos,
					caster: attacker,
					figures: draftSummons,
					vfx: draftVfx,
				}).figures;
			}
		}

		if (effect.type === "push") {
			const result = resolvePushEffect({
				effect,
				anchorTargetId,
				caster: attacker,
				figures: [...draftHeroes, ...draftMonsters, ...draftSummons],
				vfx: draftVfx,
			});
			draftHeroes = result.figures.filter((f) => isHero(f));
			draftMonsters = result.figures.filter((f) => isMonster(f));
			draftSummons = result.figures.filter((f) => isSummon(f));
			draftVfx = result.vfx;
		}

		// You can add `effect.type === "heal"` here later for enemy medics!
	}

	return {
		nextMonsters: draftMonsters,
		nextHeroes: draftHeroes,
		nextSummons: draftSummons,
		nextVfx: draftVfx,
	};
}
