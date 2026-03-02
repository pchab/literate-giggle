import type { Monster } from "@/modules/figures/domain/figures.type";
import { archer } from "../../figures/domain/monsters/archer";
import { bat } from "../../figures/domain/monsters/bat";
import { skeleton } from "../../figures/domain/monsters/skeleton";
import { monsterId } from "../../figures/figures.helpers";
import { necromancer } from "@/modules/figures/domain/monsters/necromancer";

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
				gridPosition: { col: 2, row: 2 },
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
};
