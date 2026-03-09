import type {
	BattleHero,
	BattleUnit,
	Hero,
	Monster,
	Summon,
} from "../domain/figures.type";

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
		if (["temp_block", "perma_shield"].includes(status.type)) {
			return block + status.amount;
		}
		return block;
	}, 0);
}
