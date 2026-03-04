import { golem_overseer, stone_elemental } from "@/modules/figures/data/monsters/golem.data";
import { Encounter, encounterId } from "../encounters.data";
import { monsterId } from "@/modules/figures/helpers/figures.helpers";

export const DwarvenPassageEncounters: Record<string, Encounter> = {
    [encounterId("stone_gate_guards")]: {
		id: encounterId("stone_gate_guards"),
		name: "Awakened Stones",
		generateMonsters: () => [
			{
				...stone_elemental,
				id: monsterId("elem-1"),
				currentHp: 1,
				gridPosition: { col: 3, row: 2 },
			},
			{
				...stone_elemental,
				id: monsterId("elem-2"),
				currentHp: 1,
				gridPosition: { col: 3, row: 4 },
			},
		],
	},
	[encounterId("golem_boss")]: {
		id: encounterId("golem_boss"),
		name: "The Golem Overseer",
		generateMonsters: () => [
			{
				...golem_overseer,
				id: monsterId("boss-golem"),
				currentHp: 1,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...stone_elemental,
				id: monsterId("elem-minion"),
				currentHp: 1,
				gridPosition: { col: 2, row: 3 },
			},
		],
	},
}