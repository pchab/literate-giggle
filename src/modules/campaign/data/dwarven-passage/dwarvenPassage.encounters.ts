import {
	golem_overseer,
	stone_elemental,
} from "@/modules/units/data/monsters/golem.data";
import { type Encounter, encounterId } from "../../domain/encounters.type";

export const DWARVEN_PASSAGE_ENCOUNTER_DB: Record<string, Encounter> = {
	[encounterId("stone_gate_guards")]: {
		id: encounterId("stone_gate_guards"),
		name: "Awakened Stones",
		generateMonsters: () => [
			{
				...stone_elemental,
				gridPosition: { col: 3, row: 2 },
			},
			{
				...stone_elemental,
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
				gridPosition: { col: 4, row: 3 },
			},
			{
				...stone_elemental,
				gridPosition: { col: 2, row: 3 },
			},
		],
	},
};
