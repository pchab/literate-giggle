import type { Monster } from "@/modules/figures/domain/figures.type";
import { archer } from "../figures/domain/monsters/archer";
import { bat } from "../figures/domain/monsters/bat";
import { skeleton } from "../figures/domain/monsters/skeleton";
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
	bat_swarm: {
		id: createEncounterId("bat_swarm"),
		name: "Bat swarm",
		generateMonsters: () => [
			{
				...bat,
				id: createMonsterId("bat-1"),
				currentHp: bat.maxHp,
				gridPosition: { col: 2, row: 4 },
			},
			{
				...bat,
				id: createMonsterId("bat-2"),
				currentHp: bat.maxHp,
				gridPosition: { col: 4, row: 2 },
			},
			{
				...bat,
				id: createMonsterId("bat-3"),
				currentHp: bat.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
			{
				...bat,
				id: createMonsterId("bat-4"),
				currentHp: bat.maxHp,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...bat,
				id: createMonsterId("bat-5"),
				currentHp: bat.maxHp,
				gridPosition: { col: 3, row: 4 },
			},
			{
				...bat,
				id: createMonsterId("bat-6"),
				currentHp: bat.maxHp,
				gridPosition: { col: 4, row: 4 },
			},
		],
	},
	skeleton_horde: {
		id: createEncounterId("skeleton_horde"),
		name: "Skeleton horde",
		generateMonsters: () => [
			{
				...skeleton,
				id: createMonsterId("skel-1"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
			{
				...skeleton,
				id: createMonsterId("skel-2"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...skeleton,
				id: createMonsterId("skel-3"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 3, row: 4 },
			},
			{
				...skeleton,
				id: createMonsterId("skel-4"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 4, row: 4 },
			},
		],
	},
	cultists_ambush: {
		id: createEncounterId("cultists_ambush"),
		name: "Cultists ambush",
		generateMonsters: () => [
			{
				...skeleton,
				id: createMonsterId("skel-1"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
			{
				...archer,
				id: createMonsterId("cult-1"),
				currentHp: archer.maxHp,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...archer,
				id: createMonsterId("cult-2"),
				currentHp: archer.maxHp,
				gridPosition: { col: 3, row: 4 },
			},
		],
	},
};
