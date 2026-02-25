import type { Monster } from "@/modules/figures/domain/figures.type";
import { archer } from "../figures/domain/archer";
import { skeleton } from "../figures/domain/skeleton";
import { createMonsterId } from "../figures/figures.helpers";

export interface Encounter {
	id: string & { __brand: "EncounterId" };
	name: string;
	generateMonsters: () => Monster[];
}

export function createEncounterId(id: string): Encounter["id"] {
	return id as Encounter["id"];
}

export const ENCOUNTER_DB: Record<string, Encounter> = {
	tutorial_fight: {
		id: createEncounterId("tutorial_fight"),
		name: "A lone skeleton",
		generateMonsters: () => [
			{
				...skeleton,
				id: createMonsterId("skel-1"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 2, row: 2 },
			},
		],
	},
	forest_ambush: {
		id: createEncounterId("forest_ambush"),
		name: "Cultist Ambush",
		generateMonsters: () => [
			{
				...skeleton,
				id: createMonsterId("skel-2"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 2, row: 2 },
			},
			{
				...archer,
				id: createMonsterId("cult-1"),
				currentHp: archer.maxHp,
				gridPosition: { col: 4, row: 2 },
			},
		],
	},
};
