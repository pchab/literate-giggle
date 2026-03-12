import { archer } from "@/modules/figures/data/monsters/archer.data";
import { bat } from "@/modules/figures/data/monsters/bat.data";
import { necromancer } from "@/modules/figures/data/monsters/necromancer.data";
import { skeleton } from "@/modules/figures/data/monsters/skeleton.data";
import { type Encounter, encounterId } from "../../domain/encounters.type";

export const NECROMANCER_ENCOUNTER_DB: Record<string, Encounter> = {
	[encounterId("bat_swarm")]: {
		id: encounterId("bat_swarm"),
		name: "Bat swarm",
		generateMonsters: () => [
			{
				...bat,
				gridPosition: { col: 2, row: 4 },
			},
			{
				...bat,
				gridPosition: { col: 4, row: 2 },
			},
			{
				...bat,
				gridPosition: { col: 3, row: 3 },
			},
			{
				...bat,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...bat,
				gridPosition: { col: 3, row: 4 },
			},
			{
				...bat,
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
				gridPosition: { col: 3, row: 3 },
			},
			{
				...skeleton,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...skeleton,
				gridPosition: { col: 3, row: 4 },
			},
			{
				...skeleton,
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
				gridPosition: { col: 3, row: 3 },
			},
			{
				...archer,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...archer,
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
				gridPosition: { col: 4, row: 4 },
			},
			{
				...skeleton,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...skeleton,
				gridPosition: { col: 3, row: 4 },
			},
		],
	},
};
