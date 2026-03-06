import {
	type AnchorTarget,
	anchorIsGridPosition,
	type BlockEffect,
	type CardEffect,
	type DamageEffect,
	type HealEffect,
	type MoveEffect,
	type PushEffect,
	type SummonEffect,
} from "@/modules/cards/domain/cards.type";
import { summonLibrary } from "@/modules/figures/data/summons/summons.data";
import type { Figure, Summon } from "@/modules/figures/domain/figures.type";
import { summonId } from "@/modules/figures/helpers/figures.helpers";
import type { VfxType } from "../domain/vfx.type";
import {
	applyDamageToEntity,
	applyEffectToEntity,
	getCasterFaction,
	resolveTargets,
} from "./effect.helpers";
import { isTileInBounds } from "./grid.helpers";
import { getVfxForEffect } from "./vfx.helper";

interface EffectResolverParams<
	C extends Figure,
	T extends Figure,
	E extends CardEffect,
> {
	effect: E;
	anchorTargetId: AnchorTarget | null;
	caster: C;
	figures: T[];
	vfx: Record<string, VfxType>;
	patternCells?: { col: number; row: number }[];
}
interface EffectResolverReturn<T extends Figure> {
	figures: T[];
	vfx: Record<string, VfxType>;
}

export function resolveMoveEffect<T extends Figure>({
	effect,
	anchorTargetId,
	caster,
	figures,
	vfx,
}: EffectResolverParams<T, T, MoveEffect>): EffectResolverReturn<T> {
	if (
		anchorTargetId &&
		anchorIsGridPosition(anchorTargetId) &&
		effect.target === "self"
	) {
		return {
			figures: figures.map((figure) =>
				figure.id === caster.id
					? { ...figure, gridPosition: anchorTargetId }
					: figure,
			),
			vfx,
		};
	}
	return { figures, vfx };
}

export function resolveSummonEffect<T extends Figure>({
	effect,
	anchorTargetId,
	caster,
	figures: summons,
	vfx,
}: EffectResolverParams<
	T,
	Summon,
	SummonEffect
>): EffectResolverReturn<Summon> {
	const allegiance = getCasterFaction(caster) === "HERO" ? "PLAYER" : "ENEMY";

	if (anchorTargetId && anchorIsGridPosition(anchorTargetId)) {
		const blueprint = summonLibrary[effect.blueprintId];
		return {
			figures: [
				...summons,
				{
					id: summonId(Date.now()),
					...blueprint,
					currentHp: blueprint.maxHp,
					gridPosition: anchorTargetId,
					allegiance,
				},
			],
			vfx,
		};
	}
	return { figures: summons, vfx };
}

export function resolveStandardEffect<T extends Figure>({
	effect,
	anchorTargetId,
	caster,
	figures,
	vfx,
	patternCells,
}: EffectResolverParams<
	T,
	T,
	DamageEffect | HealEffect | BlockEffect
>): EffectResolverReturn<T> {
	const targets = resolveTargets(
		effect.target,
		anchorTargetId,
		caster.id,
		figures,
		patternCells,
	);

	const updatedFigures = figures.map((figure) =>
		targets.includes(figure.id) ? applyEffectToEntity(figure, effect) : figure,
	);
	const newVfx = getVfxForEffect(
		effect,
		updatedFigures
			.filter((f) => targets.includes(f.id))
			.map((f) => f.gridPosition),
	);
	Object.assign(vfx, newVfx);

	return { figures: updatedFigures, vfx };
}

export function resolvePushEffect<T extends Figure>({
	effect,
	anchorTargetId,
	caster,
	figures,
	vfx,
}: EffectResolverParams<T, T, PushEffect>): EffectResolverReturn<T> {
	const draftFigures = [...figures];
	const targets = resolveTargets(
		effect.target,
		anchorTargetId,
		caster.id,
		draftFigures,
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

			const isOccupied = draftFigures.some(
				(f) =>
					f.gridPosition.col === nextPos.col &&
					f.gridPosition.row === nextPos.row,
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

	return {
		figures: draftFigures.map((figure) =>
			targets.includes(figure.id) ? processPush(figure) : figure,
		),
		vfx,
	};
}
