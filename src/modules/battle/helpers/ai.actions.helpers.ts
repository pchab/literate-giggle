import {
	getManhattanDistance,
	isTileInBounds,
} from "@/modules/battle/helpers/grid.helpers";
import type { BattleState } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import type {
	Figure,
	Monster,
	Summon,
} from "@/modules/figures/domain/figures.type";
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

export function handleAICardIntent(
	state: BattleState,
	attacker: Monster | Summon,
	card: Card,
) {
	const { heroes, monsters, summons } = state;

	const { reachableTarget, moveDest } = getIdealTarget(attacker, card, [
		...heroes,
		...monsters,
		...summons,
	]);

	if (!reachableTarget || !moveDest) return null;

	let draftMonsters = state.monsters.map((m) =>
		m.id === attacker.id ? { ...m, gridPosition: moveDest } : m,
	);
	let draftSummons = state.summons.map((s) =>
		s.id === attacker.id ? { ...s, gridPosition: moveDest } : s,
	);
	let draftHeroes = [...state.heroes];
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

	const collision = getActualTarget(moveDest, reachableTarget.gridPosition, [
		...draftHeroes,
		...draftMonsters,
		...draftSummons,
	]);
	const finalTargetPos = collision
		? collision.gridPosition
		: reachableTarget.gridPosition;

	const targetedCells = filterGridByAttackPattern(
		card,
		finalTargetPos,
		moveDest,
	);
	const anchorTargetId: Figure["id"] = collision
		? collision.id
		: reachableTarget.id;

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
