import {
	type AnchorTarget,
	anchorIsGridPosition,
	type CardEffect,
	type EffectTarget,
} from "@/modules/cards/domain/cards.type";
import type { Figure, Summon } from "@/modules/figures/domain/figures.type";
import {
	isHeroId,
	isMonsterId,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";

type CasterFaction = "HERO" | "MONSTER";
export function getCasterFaction<T extends Figure>(caster: T): CasterFaction {
	if (isHeroId(caster.id)) return "HERO";
	if (isMonsterId(caster.id)) return "MONSTER";
	if (isSummon(caster)) {
		return caster.allegiance === "PLAYER" ? "HERO" : "MONSTER";
	}
	return "HERO"; // Default to HERO if unknown, though ideally this should never happen
}

function filterSummonByFaction(faction: CasterFaction) {
	return ({ allegiance }: Summon) =>
		faction === "HERO" ? allegiance === "PLAYER" : allegiance === "ENEMY";
}

export function resolveTargets<T extends Figure>(
	targetType: EffectTarget,
	anchorTargetId: AnchorTarget | null,
	casterId: T["id"],
	currentFigures: T[],
	patternCells?: { col: number; row: number }[],
): T["id"][] {
	const caster = currentFigures.find((f) => f.id === casterId);
	if (!caster) {
		console.warn(`Caster with ID ${casterId} not found among current figures.`);
		return [];
	}

	if (targetType === "self") {
		return [caster.id];
	}

	if (targetType === "anchor" && anchorTargetId) {
		if (anchorIsGridPosition(anchorTargetId)) {
			if (!patternCells) {
				return currentFigures
					.filter(
						(f) =>
							f.gridPosition.col === anchorTargetId.col &&
							f.gridPosition.row === anchorTargetId.row,
					)
					.map((f) => f.id);
			} else {
				return currentFigures
					.filter((f) =>
						patternCells.some(
							(p) =>
								p.col === f.gridPosition.col && p.row === f.gridPosition.row,
						),
					)
					.map((f) => f.id);
			}
		}
		if (typeof anchorTargetId === "string") {
			return [anchorTargetId];
		}
	}

	const casterFaction = getCasterFaction(caster);
	if (targetType === "all_enemies") {
		if (casterFaction === "HERO") {
			return [
				// return all monsters + enemy summons
				...currentFigures.filter(({ id }) => isMonsterId(id)),
				...currentFigures
					.filter((figure) => isSummon(figure))
					.filter(filterSummonByFaction("MONSTER")),
			].map(({ id }) => id);
		}
		if (casterFaction === "MONSTER") {
			return [
				// return all heroes + player summons
				...currentFigures.filter(({ id }) => isHeroId(id)),
				...currentFigures
					.filter((figure) => isSummon(figure))
					.filter(filterSummonByFaction("HERO")),
			].map(({ id }) => id);
		}
	}

	if (targetType === "all_allies") {
		if (casterFaction === "HERO") {
			return [
				// return all heroes + player summons
				...currentFigures.filter(({ id }) => isHeroId(id)),
				...currentFigures
					.filter((figure) => isSummon(figure))
					.filter(filterSummonByFaction("HERO")),
			].map(({ id }) => id);
		}
		if (casterFaction === "MONSTER") {
			return [
				// return all monsters + enemy summons
				...currentFigures.filter(({ id }) => isMonsterId(id)),
				...currentFigures
					.filter((figure) => isSummon(figure))
					.filter(filterSummonByFaction("MONSTER")),
			].map(({ id }) => id);
		}
	}

	return [];
}

export function applyDamageToEntity<T extends Figure>(
	entity: T,
	damage: number,
): T {
	const effectiveDmg = Math.max(0, damage - entity.baseDef);
	const hpDamage = Math.max(0, effectiveDmg - entity.currentBlock);
	const newBlock = Math.max(0, entity.currentBlock - effectiveDmg);

	return {
		...entity,
		currentHp: Math.max(0, entity.currentHp - hpDamage),
		currentBlock: newBlock,
	};
}

export function applyEffectToEntity<T extends Figure>(
	entity: T,
	effect: CardEffect,
): T {
	if (effect.type === "heal") {
		return {
			...entity,
			currentHp: Math.min(entity.maxHp, entity.currentHp + effect.amount),
		};
	}

	if (effect.type === "block") {
		return {
			...entity,
			currentBlock: Math.max(entity.currentBlock, effect.amount),
		};
	}

	if (effect.type === "damage") {
		return applyDamageToEntity(entity, effect.amount);
	}

	return entity;
}
