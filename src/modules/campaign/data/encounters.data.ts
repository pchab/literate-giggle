import { archer } from "@/modules/figures/data/monsters/archer.data";
import { bat } from "@/modules/figures/data/monsters/bat.data";
import {
	golem_overseer,
	stone_elemental,
} from "@/modules/figures/data/monsters/golem.data";
import { necromancer } from "@/modules/figures/data/monsters/necromancer.data";
import { skeleton } from "@/modules/figures/data/monsters/skeleton.data";
import type { Monster } from "@/modules/figures/domain/figures.type";
import { monsterId } from "@/modules/figures/helpers/figures.helpers";

export interface Encounter {
	id: string & { __brand: "EncounterId" };
	name: string;
	generateMonsters: () => Monster[];
}

export function encounterId(id: string): Encounter["id"] {
	return `encounter-${id}` as Encounter["id"];
}

export const ENCOUNTER_DB: Record<string, Encounter> = {
	
};
