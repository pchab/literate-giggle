import type { Hero, Monster } from "./domain/figures.type";

export function heroId(numericOrUuid: string | number): Hero["id"] {
	return `hero-${numericOrUuid}` as Hero["id"];
}

export function monsterId(numericOrUuid: string | number): Monster["id"] {
	return `monster-${numericOrUuid}` as Monster["id"];
}

export function isHeroId(id: string): id is Hero["id"] {
	return id.startsWith("hero-");
}

export function isMonsterId(id: string): id is Monster["id"] {
	return id.startsWith("monster-");
}
