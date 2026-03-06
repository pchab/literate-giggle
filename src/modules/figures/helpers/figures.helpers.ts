import type { Figure, Hero, Monster, Summon } from "../domain/figures.type";

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

export function isHero(entity: Figure): entity is Hero {
	return isHeroId(entity.id);
}

export function isMonster(entity: Figure): entity is Monster {
	return isMonsterId(entity.id);
}

export function isSummon(entity: Figure): entity is Summon {
	return isSummonId(entity.id);
}
