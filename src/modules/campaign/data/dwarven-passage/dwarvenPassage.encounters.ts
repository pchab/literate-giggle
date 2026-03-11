import {
	golem_overseer,
	stone_elemental,
} from "@/modules/figures/data/monsters/golem.data";
import { monsterId } from "@/modules/figures/helpers/figures.helpers";
import { type Encounter, encounterId } from "../../domain/encounters.type";

export const DWARVEN_PASSAGE_ENCOUNTER_DB: Record<string, Encounter> = {
	[encounterId("stone_gate_guards")]: {
		id: encounterId("stone_gate_guards"),
		name: "Awakened Stones",
		generateMonsters: () => [
			{
				...stone_elemental,
				id: monsterId("elem-1"),
				currentHp: stone_elemental.maxHp,
				statuses: [],
				gridPosition: { col: 3, row: 2 },
			},
			{
				...stone_elemental,
				id: monsterId("elem-2"),
				currentHp: stone_elemental.maxHp,
				statuses: [],
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
				currentHp: golem_overseer.maxHp,
				statuses: [],
				gridPosition: { col: 4, row: 3 },
			},
			{
				...stone_elemental,
				id: monsterId("elem-minion"),
				currentHp: stone_elemental.maxHp,
				statuses: [],
				gridPosition: { col: 2, row: 3 },
			},
		],
	},
};
