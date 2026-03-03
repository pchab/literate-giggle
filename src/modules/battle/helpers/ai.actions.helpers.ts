import type { Attack } from "@/modules/battle/domain/attacks.type";
import {
	getManhattanDistance,
	isTileInBounds,
} from "@/modules/battle/helpers/grid.helpers";
import type { BattleState } from "@/modules/battle/store/battle.store";
import { skeleton } from "@/modules/figures/data/monsters/skeleton.data";
import type { Monster } from "@/modules/figures/domain/figures.type";
import { monsterId } from "@/modules/figures/helpers/figures.helpers";
import {
	filterGridByAttackPattern,
	getActualTarget,
	getIdealTarget,
} from "./ai.move.helpers";

// --- ACTION HANDLER 1: SUMMONING ---
export function handleSummon(
	state: BattleState,
	caster: Monster,
	attack: Attack,
): Monster[] {
	const possibleSpawns = [
		{ col: caster.gridPosition.col, row: caster.gridPosition.row - 1 },
		{ col: caster.gridPosition.col - 1, row: caster.gridPosition.row },
		{ col: caster.gridPosition.col, row: caster.gridPosition.row + 1 },
		{ col: caster.gridPosition.col + 1, row: caster.gridPosition.row },
	].filter(isTileInBounds);

	const spawnPos = possibleSpawns.find((pos) => {
		const isOccupiedByHero = state.heroes.some(
			(h) => h.gridPosition.col === pos.col && h.gridPosition.row === pos.row,
		);
		const isOccupiedByMonster = state.monsters.some(
			(m) => m.gridPosition.col === pos.col && m.gridPosition.row === pos.row,
		);
		return !isOccupiedByHero && !isOccupiedByMonster;
	});

	if (spawnPos && attack.summonType === "SKELETON") {
		const newSkeleton: Monster = {
			...skeleton,
			id: monsterId(`skel-summon-${Date.now()}`),
			currentHp: skeleton.maxHp,
			gridPosition: spawnPos,
		};
		// Return a NEW array to respect immutability
		return [...state.monsters, newSkeleton];
	}

	return state.monsters;
}

// --- ACTION HANDLER 2: MOVE & ATTACK ---
export function handleMoveAndAttack(
	state: BattleState,
	attacker: Monster,
	attack: Attack,
) {
	const { reachableTarget, moveDest } = getIdealTarget(
		attacker,
		attack,
		state.heroes,
		state.monsters,
	);

	if (!reachableTarget || !moveDest) return null; // Can't do anything

	// 1. Resolve Movement
	const nextMonsters = state.monsters.map((m) =>
		m.id === attacker.id ? { ...m, gridPosition: moveDest } : m,
	);

	const distanceToTarget = getManhattanDistance(
		moveDest,
		reachableTarget.gridPosition,
	);
	if (
		distanceToTarget < attack.minRange ||
		distanceToTarget > attack.maxRange
	) {
		return { nextMonsters, nextHeroes: state.heroes }; // Moved, but out of range to attack
	}

	// 2. Resolve Combat
	const collision = getActualTarget(
		moveDest,
		reachableTarget.gridPosition,
		state.heroes,
		nextMonsters,
	);
	const finalTargetPos = collision
		? collision.unit.gridPosition
		: reachableTarget.gridPosition;
	const targetedCells = filterGridByAttackPattern(attack, finalTargetPos);

	const nextHeroes = state.heroes.map((hero) => {
		const isTargeted = targetedCells.some(
			({ col, row }) =>
				col === hero.gridPosition.col && row === hero.gridPosition.row,
		);

		if (!isTargeted) return hero;

		const effectiveDmg = Math.max(0, attack.damage - hero.baseDef);
		const hpDamage = Math.max(0, effectiveDmg - hero.currentBlock);
		const newBlock = Math.max(0, hero.currentBlock - effectiveDmg);

		return {
			...hero,
			currentHp: Math.max(0, hero.currentHp - hpDamage),
			currentBlock: newBlock,
		};
	});

	return { nextMonsters, nextHeroes };
}
