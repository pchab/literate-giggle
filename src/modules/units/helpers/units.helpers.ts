import type { StatusType } from "../domain/status.type";
import type {
	BattleHero,
	BattleUnit,
	Hero,
	Monster,
	Summon,
	UnitBlueprint,
	UnitSpriteVariant,
} from "../domain/units.type";

export function heroId(numericOrUuid: string | number): Hero["id"] {
	return `hero-${numericOrUuid}` as Hero["id"];
}

export function monsterId(numericOrUuid: string | number): Monster["id"] {
	return `monster-${numericOrUuid}` as Monster["id"];
}

export function summonId(numericOrUuid: string | number): Summon["id"] {
	return `summon-${numericOrUuid}` as Summon["id"];
}

export function isHeroId(id: string): id is Hero["id"] {
	return id.startsWith("hero-");
}

export function isMonsterId(id: string): id is Monster["id"] {
	return id.startsWith("monster-");
}

export function isSummonId(id: string): id is Summon["id"] {
	return id.startsWith("summon-");
}

export function isHero(entity: BattleUnit): entity is BattleHero {
	return isHeroId(entity.id);
}

export function isMonster(entity: BattleUnit): entity is Monster {
	return isMonsterId(entity.id);
}

export function isSummon(entity: BattleUnit): entity is Summon {
	return isSummonId(entity.id);
}

export function getBlockFromStatuses(statuses: BattleHero["statuses"]): number {
	return statuses.reduce((block, status) => {
		if (status.type === "block") {
			return block + status.amount;
		}
		return block;
	}, 0);
}

export const hasStatus = (
	unit: Pick<BattleUnit, "statuses">,
	type: StatusType,
): boolean => unit.statuses?.some((s) => s.type === type) ?? false;

export const sumStatus = (
	unit: Pick<BattleUnit, "statuses">,
	type: StatusType,
): number =>
	unit.statuses?.reduce(
		(acc, s) => (s.type === type ? acc + s.amount : acc),
		0,
	) ?? 0;

/** Frozen or stunned units lose their whole turn (no move, no card). */
export const isIncapacitated = (unit: Pick<BattleUnit, "statuses">): boolean =>
	hasStatus(unit, "frozen") || hasStatus(unit, "stun");

/** Movement after haste / chill. Never negative. */
export const getMoveValue = (
	unit: Pick<BattleUnit, "statuses" | "baseMove">,
): number => {
	if (isIncapacitated(unit)) return 0;
	const chillPenalty = hasStatus(unit, "chill") ? 1 : 0;
	return Math.max(0, unit.baseMove + sumStatus(unit, "haste") - chillPenalty);
};

export function getVariantFromBlueprint({
	availableVariants,
}: UnitBlueprint): UnitSpriteVariant {
	return availableVariants
		? availableVariants[Math.floor(Math.random() * availableVariants.length)]
		: "default";
}
