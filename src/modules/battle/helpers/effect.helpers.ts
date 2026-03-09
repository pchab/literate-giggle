import {
	type AnchorTarget,
	anchorIsGridPosition,
	type CardEffect,
	type EffectTarget,
} from "@/modules/cards/domain/cards.type";
import type { BattleUnit, Summon } from "@/modules/figures/domain/figures.type";
import {
	isHeroId,
	isMonsterId,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";

type CasterFaction = "HERO" | "MONSTER";
export function getCasterFaction<T extends BattleUnit>(caster: T): CasterFaction {
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

export function resolveTargets<T extends BattleUnit>(
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
		if (patternCells && patternCells.length > 0) {
			return currentFigures
				.filter((f) =>
					patternCells.some(
						(p) => p.col === f.gridPosition.col && p.row === f.gridPosition.row,
					),
				)
				.map((f) => f.id);
		}

		if (anchorIsGridPosition(anchorTargetId)) {
			return currentFigures
				.filter(
					(f) =>
						f.gridPosition.col === anchorTargetId.col &&
						f.gridPosition.row === anchorTargetId.row,
				)
				.map((f) => f.id);
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

export function applyDamageToEntity<T extends BattleUnit>(
	entity: T,
	baseDamage: number,
): T {
	let incomingDamage = baseDamage;

	const isVulnerable = entity.statuses.some((s) => s.type === "vulnerable");
	if (isVulnerable) {
		incomingDamage += 2;
	}

	let effectiveDmg = Math.max(0, incomingDamage - entity.baseDef);

	const updatedStatuses = entity.statuses.map((status) => {
		if (status.type !== "temp_block" && status.type !== "perma_shield") {
			return status;
		}

		if (effectiveDmg <= 0) return status;

		if (status.amount >= effectiveDmg) {
			status.amount -= effectiveDmg;
			effectiveDmg = 0;
		} else {
			effectiveDmg -= status.amount;
			status.amount = 0;
		}
		return status;
	});

	const finalStatuses = updatedStatuses.filter((s) => {
		if (
			(s.type === "temp_block" || s.type === "perma_shield") &&
			s.amount <= 0
		) {
			return false;
		}
		return true;
	});

	return {
		...entity,
		currentHp: Math.max(0, entity.currentHp - effectiveDmg),
		statuses: finalStatuses,
	};
}

export function applyEffectToEntity<T extends BattleUnit>(
	entity: T,
	effect: CardEffect,
): T {
	if (effect.type === "heal") {
		return {
			...entity,
			currentHp: Math.min(entity.maxHp, entity.currentHp + effect.amount),
		};
	}

	if (effect.type === "damage") {
		return applyDamageToEntity(entity, effect.amount);
	}

	if (effect.type === "apply_status") {
		const newStatuses = [...entity.statuses];
		const existingStatusIndex = newStatuses.findIndex(
			(s) => s.type === effect.statusType,
		);

		if (existingStatusIndex !== -1) {
			const current = newStatuses[existingStatusIndex];
			newStatuses[existingStatusIndex] = {
				...current,
				amount: current.amount + effect.amount,
				duration:
					current.duration === -1 || effect.duration === -1
						? -1
						: Math.max(current.duration, effect.duration),
			};
		} else {
			newStatuses.push({
				type: effect.statusType,
				amount: effect.amount,
				duration: effect.duration,
			});
		}

		return { ...entity, statuses: newStatuses };
	}

	return entity;
}

export function tickStatuses<T extends BattleUnit>(figures: T[]): T[] {
	return figures.map((figure) => {
		if (figure.currentHp <= 0) return figure;

		let poisonDamage = 0;

		const poison = figure.statuses.find((s) => s.type === "poison");
		if (poison) {
			poisonDamage += poison.amount;
		}

		const newHp = Math.max(0, figure.currentHp - poisonDamage);

		const newStatuses = figure.statuses
			.map((status) => ({
				...status,
				duration: status.duration === -1 ? -1 : status.duration - 1,
			}))
			.filter((status) => status.duration > 0 || status.duration === -1);

		return {
			...figure,
			currentHp: newHp,
			statuses: newStatuses,
		};
	});
}
