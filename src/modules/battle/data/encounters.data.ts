import { archer } from "@/modules/figures/data/monsters/archer.data";
import { bat } from "@/modules/figures/data/monsters/bat.data";
import { golem_overseer, stone_elemental } from "@/modules/figures/data/monsters/golem.data";
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
	[encounterId("tutorial_fight")]: {
		id: encounterId("tutorial_fight"),
		name: "A lone skeleton",
		generateMonsters: () => [
			{
				...skeleton,
				id: monsterId("skel-1"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
		],
	},
	[encounterId("bat_swarm")]: {
		id: encounterId("bat_swarm"),
		name: "Bat swarm",
		generateMonsters: () => [
			{
				...bat,
				id: monsterId("bat-1"),
				currentHp: bat.maxHp,
				gridPosition: { col: 2, row: 4 },
			},
			{
				...bat,
				id: monsterId("bat-2"),
				currentHp: bat.maxHp,
				gridPosition: { col: 4, row: 2 },
			},
			{
				...bat,
				id: monsterId("bat-3"),
				currentHp: bat.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
			{
				...bat,
				id: monsterId("bat-4"),
				currentHp: bat.maxHp,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...bat,
				id: monsterId("bat-5"),
				currentHp: bat.maxHp,
				gridPosition: { col: 3, row: 4 },
			},
			{
				...bat,
				id: monsterId("bat-6"),
				currentHp: bat.maxHp,
				gridPosition: { col: 4, row: 4 },
			},
		],
	},
	[encounterId("skeleton_horde")]: {
		id: encounterId("skeleton_horde"),
		name: "Skeleton horde",
		generateMonsters: () => [
			{
				...skeleton,
				id: monsterId("skel-1"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
			{
				...skeleton,
				id: monsterId("skel-2"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...skeleton,
				id: monsterId("skel-3"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 3, row: 4 },
			},
			{
				...skeleton,
				id: monsterId("skel-4"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 4, row: 4 },
			},
		],
	},
	[encounterId("cultists_ambush")]: {
		id: encounterId("cultists_ambush"),
		name: "Cultists ambush",
		generateMonsters: () => [
			{
				...skeleton,
				id: monsterId("skel-1"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
			{
				...archer,
				id: monsterId("cult-1"),
				currentHp: archer.maxHp,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...archer,
				id: monsterId("cult-2"),
				currentHp: archer.maxHp,
				gridPosition: { col: 3, row: 4 },
			},
		],
	},
	[encounterId("necromancer_boss")]: {
		id: encounterId("necromancer_boss"),
		name: "The Crypt Master",
		generateMonsters: () => [
			{
				...necromancer,
				id: monsterId("boss-necro-1"),
				currentHp: necromancer.maxHp,
				gridPosition: { col: 4, row: 4 },
			},
			{
				...skeleton,
				id: monsterId("skel-minion-1"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...skeleton,
				id: monsterId("skel-minion-2"),
				currentHp: skeleton.maxHp,
				gridPosition: { col: 3, row: 4 },
			},
		],
	},
	[encounterId("stone_gate_guards")]: {
        id: encounterId("stone_gate_guards"),
        name: "Awakened Stones",
        generateMonsters: () => [
            { ...stone_elemental, id: monsterId("elem-1"), currentHp: 1, gridPosition: { col: 3, row: 2 } },
            { ...stone_elemental, id: monsterId("elem-2"), currentHp: 1, gridPosition: { col: 3, row: 4 } },
        ],
    },
    [encounterId("golem_boss")]: {
        id: encounterId("golem_boss"),
        name: "The Golem Overseer",
        generateMonsters: () => [
            { ...golem_overseer, id: monsterId("boss-golem"), currentHp: 1, gridPosition: { col: 4, row: 3 } },
            { ...stone_elemental, id: monsterId("elem-minion"), currentHp: 1, gridPosition: { col: 2, row: 3 } },
        ],
    },
};
