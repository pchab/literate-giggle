import {
	type AnchorTarget,
	anchorIsGridPosition,
	anchorIsHeroId,
	anchorIsMonsterId,
	type BlockEffect,
	type DamageEffect,
	type EffectTarget,
	type HealEffect,
	type MoveEffect,
	type PushEffect,
	type SummonEffect,
} from "@/modules/cards/domain/cards.type";
import { summonLibrary } from "@/modules/figures/data/summons/summons.data";
import type {
	Allegiance,
	Figure,
	Hero,
	Monster,
	Summon,
} from "@/modules/figures/domain/figures.type";
import { summonId } from "@/modules/figures/helpers/figures.helpers";
import type { VfxType } from "../domain/vfx.type";
import {
	applyDamageToEntity,
	applyEffectToHero,
	applyEffectToMonster,
} from "./effect.helpers";
import { isTileInBounds } from "./grid.helpers";
import { getVfxForEffect } from "./vfx.helper";

function resolveTargets(
	targetType: EffectTarget,
	anchorTargetId: AnchorTarget | null,
	casterId: Hero["id"],
	currentMonsters: Monster[],
) {
	const heroIds: string[] = [];
	const monsterIds: string[] = [];

	if (targetType === "self") {
		heroIds.push(casterId);
	} else if (
		targetType === "anchor" &&
		anchorTargetId &&
		typeof anchorTargetId === "string"
	) {
		if (anchorIsHeroId(anchorTargetId)) heroIds.push(anchorTargetId);
		if (anchorIsMonsterId(anchorTargetId)) monsterIds.push(anchorTargetId);
	} else if (targetType === "all_enemies") {
		monsterIds.push(...currentMonsters.map((m) => m.id));
	}

	return { heroIds, monsterIds };
}

// --- 1. MOVE RESOLVER ---
export function resolveMoveEffect(
	effect: MoveEffect,
	anchorTargetId: AnchorTarget | null,
	heroId: Hero["id"],
	heroes: Hero[],
) {
	if (
		anchorTargetId &&
		anchorIsGridPosition(anchorTargetId) &&
		effect.target === "self"
	) {
		return heroes.map((hero) =>
			hero.id === heroId ? { ...hero, gridPosition: anchorTargetId } : hero,
		);
	}
	return heroes;
}

// --- 2. SUMMON RESOLVER ---
export function resolveSummonEffect(
	effect: SummonEffect,
	anchorTargetId: AnchorTarget | null,
	summons: Summon[],
) {
	if (anchorTargetId && anchorIsGridPosition(anchorTargetId)) {
		const blueprint = summonLibrary[effect.blueprintId];
		return [
			...summons,
			{
				id: summonId(Date.now()),
				...blueprint,
				currentHp: blueprint.maxHp,
				gridPosition: anchorTargetId,
				allegiance: "PLAYER" as Allegiance,
			},
		];
	}
	return summons;
}

// --- 3. STANDARD EFFECT RESOLVER (Damage, Heal, Block) ---
export function resolveStandardEffect(
	effect: DamageEffect | HealEffect | BlockEffect,
	anchorTargetId: AnchorTarget | null,
	casterId: Hero["id"],
	heroes: Hero[],
	monsters: Monster[],
	vfx: Record<string, VfxType>,
) {
	const targets = resolveTargets(
		effect.target,
		anchorTargetId,
		casterId,
		monsters,
	);

	const updatedHeroes = heroes.map((hero) =>
		targets.heroIds.includes(hero.id) ? applyEffectToHero(hero, effect) : hero,
	);
	const updatedMonsters = monsters.map((monster) =>
		targets.monsterIds.includes(monster.id)
			? applyEffectToMonster(monster, effect)
			: monster,
	);

	const newVfx = getVfxForEffect(effect, {
		monsterPositions: targets.monsterIds
			.map(
				(monsterId) =>
					updatedMonsters.find((m) => m.id === monsterId)?.gridPosition,
			)
			.filter((pos) => pos !== undefined),
		heroPositions: targets.heroIds
			.map((heroId) => updatedHeroes.find((h) => h.id === heroId)?.gridPosition)
			.filter((pos) => pos !== undefined),
	});
	Object.assign(vfx, newVfx);

	return { heroes: updatedHeroes, monsters: updatedMonsters, vfx };
}

// --- 4. PUSH RESOLVER (The New Engine!) ---
export function resolvePushEffect(
	effect: PushEffect,
	anchorTargetId: AnchorTarget | null,
	casterId: Hero["id"],
	heroes: Hero[],
	monsters: Monster[],
	summons: Summon[],
) {
	let draftHeroes = [...heroes];
	let draftMonsters = [...monsters];

	const caster = draftHeroes.find((h) => h.id === casterId);
	if (!caster || !caster.gridPosition)
		return { heroes: draftHeroes, monsters: draftMonsters };

	const targets = resolveTargets(
		effect.target,
		anchorTargetId,
		casterId,
		draftMonsters,
	);
	const { col: cX, row: cY } = caster.gridPosition;

	const processPush = <T extends Figure>(entity: T) => {
		const { col: tX, row: tY } = entity.gridPosition;
		const dx = Math.sign(tX - cX);
		const dy = Math.sign(tY - cY);

		if (dx === 0 && dy === 0) return entity;

		let currentX = tX;
		let currentY = tY;
		let collided = false;

		// Step-by-step raycast
		for (let i = 0; i < effect.distance; i++) {
			const nextX = currentX + dx;
			const nextY = currentY + dy;
			const nextPos = { col: nextX, row: nextY };

			const isOccupied =
				draftHeroes.some(
					(h) =>
						h.gridPosition.col === nextPos.col &&
						h.gridPosition.row === nextPos.row,
				) ||
				draftMonsters.some(
					(m) =>
						m.gridPosition.col === nextPos.col &&
						m.gridPosition.row === nextPos.row,
				) ||
				summons.some(
					(s) =>
						s.gridPosition.col === nextPos.col &&
						s.gridPosition.row === nextPos.row,
				);

			if (!isTileInBounds(nextPos) || isOccupied) {
				collided = true;
				break;
			}

			currentX = nextX;
			currentY = nextY;
		}

		let updatedEntity = {
			...entity,
			gridPosition: { col: currentX, row: currentY },
		};

		if (collided && effect.collisionDamage > 0) {
			updatedEntity = applyDamageToEntity(
				updatedEntity,
				effect.collisionDamage,
			);
		}

		return updatedEntity;
	};

	draftMonsters = draftMonsters.map((m) =>
		targets.monsterIds.includes(m.id) ? processPush(m) : m,
	);
	draftHeroes = draftHeroes.map((h) =>
		targets.heroIds.includes(h.id) ? processPush(h) : h,
	);

	return { heroes: draftHeroes, monsters: draftMonsters };
}
