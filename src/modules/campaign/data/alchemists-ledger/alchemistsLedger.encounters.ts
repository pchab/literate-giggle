import { cardId } from "@/modules/cards/helpers/cards.helper";
import { crazedAlchemist } from "@/modules/figures/data/monsters/alchemist";
import {
	goblin,
	goblinShaman,
} from "@/modules/figures/data/monsters/goblin.data";
import { shelves } from "@/modules/figures/data/summons/shelves";
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
				gridPosition: { col: 1, row: 4 },
				intentPool: [
					{
						cardId: cardId("reckless_experiment"),
						weight: 1,
					},
				],
			},
			{
				...goblin,
				gridPosition: { col: 2, row: 4 },
				intentPool: [
					{
						cardId: cardId("reckless_experiment"),
						weight: 1,
					},
				],
			},
			{
				...goblin,
				gridPosition: { col: 4, row: 0 },
				intentPool: [
					{
						cardId: cardId("reckless_experiment"),
						weight: 1,
					},
				],
			},
			{
				...goblin,
				gridPosition: { col: 4, row: 1 },
				intentPool: [
					{
						cardId: cardId("reckless_experiment"),
						weight: 1,
					},
				],
			},
			{
				...goblinShaman,
				gridPosition: { col: 4, row: 4 },
			},
		],
	},
	[THE_ALCHEMISTS_LEDGER.encounters.mutated_barnaby]: {
		id: THE_ALCHEMISTS_LEDGER.encounters.mutated_barnaby,
		name: "Crazed Alchemist",
		generateMonsters: () => [
			{
				...crazedAlchemist,
				gridPosition: { col: 3, row: 3 },
			},
		],
		generateSummons: () => [
			{
				...shelves,
				gridPosition: { col: 0, row: 2 },
				allegiance: "NEUTRAL",
			},
			{
				...shelves,
				gridPosition: { col: 0, row: 3 },
				allegiance: "NEUTRAL",
			},
			{
				...shelves,
				gridPosition: { col: 0, row: 4 },
				allegiance: "NEUTRAL",
			},

			{
				...shelves,
				gridPosition: { col: 2, row: 0 },
				allegiance: "NEUTRAL",
			},
			{
				...shelves,
				gridPosition: { col: 3, row: 0 },
				allegiance: "NEUTRAL",
			},
			{
				...shelves,
				gridPosition: { col: 4, row: 0 },
				allegiance: "NEUTRAL",
			},
		],
	},
};
