import { goblin } from "@/modules/figures/data/monsters/goblin.data";
import { acidFlask } from "@/modules/figures/data/summons/acidFlask";
import type { Encounter } from "../../domain/encounters.type";
import { THE_ALCHEMISTS_LEDGER } from "./alchemistsLedger.definitions";

export const alchemistEncounters: Record<string, Encounter> = {
	[THE_ALCHEMISTS_LEDGER.encounters.goblin_band]: {
		id: THE_ALCHEMISTS_LEDGER.encounters.goblin_band,
		name: "Goblin Band",
		generateMonsters: () => [
			{
				...goblin,
				gridPosition: { col: 2, row: 4 },
			},
			{
				...goblin,
				gridPosition: { col: 3, row: 4 },
			},
			{
				...goblin,
				gridPosition: { col: 3, row: 2 },
			},
		],
	},
	[THE_ALCHEMISTS_LEDGER.encounters.goblin_shaman]: {
		id: THE_ALCHEMISTS_LEDGER.encounters.goblin_shaman,
		name: "Goblin Laboratory",

		generateMonsters: () => [
			{
				...goblin,
				gridPosition: { col: 2, row: 4 },
			},
			{
				...goblin,
				gridPosition: { col: 1, row: 2 },
			},
			{
				...goblin,
				gridPosition: { col: 3, row: 2 },
			},
		],

		generateSummons: () => [
			{
				...acidFlask,
				gridPosition: { col: 2, row: 2 },
				allegiance: "NEUTRAL",
			},
			{
				...acidFlask,
				gridPosition: { col: 1, row: 3 },
				allegiance: "NEUTRAL",
			},
			{
				...acidFlask,
				gridPosition: { col: 3, row: 3 },
				allegiance: "NEUTRAL",
			},
		],
	},
};
