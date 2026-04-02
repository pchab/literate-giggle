import { getCellId } from "@/modules/battle/helpers/grid.helpers";
import { giantToad } from "@/modules/figures/data/monsters/giant-toad";
import { smugglerCrate } from "@/modules/figures/data/summons/smugglersCrate";
import type { Encounter } from "../../domain/encounters.type";
import { QUEST_3_IRONHOLD_SUMP } from "./sewerContamination.definitions";

const sewerBounds = { cols: 7, rows: 7 };
const villageBounds = { cols: 12, rows: 8 };

export const sewerContaminationEncounters: Record<string, Encounter> = {
	[QUEST_3_IRONHOLD_SUMP.encounters.giant_toad]: {
		id: QUEST_3_IRONHOLD_SUMP.encounters.giant_toad,
		name: "Giant Toad",
		generateMonsters: () => [
			{
				...giantToad,
				gridPosition: { col: 4, row: 5 },
			},
		],
		generateSummons: () => [
			{
				...smugglerCrate,
				id: "crate_1",
				gridPosition: { col: 4, row: 0 },
				allegiance: "NEUTRAL",
			},
			{
				...smugglerCrate,
				id: "crate_2",
				gridPosition: { col: 5, row: 0 },
				allegiance: "NEUTRAL",
			},
			{
				...smugglerCrate,
				id: "crate_4",
				gridPosition: { col: 0, row: 6 },
				allegiance: "NEUTRAL",
			},
			{
				...smugglerCrate,
				id: "crate_3",
				gridPosition: { col: 1, row: 6 },
				allegiance: "NEUTRAL",
			},
		],
		surfaces: {
			[getCellId({ col: 0, row: 2 })]: {
				id: getCellId({ col: 0, row: 2 }),
				spriteBase: "/surfaces/sewers_stream.webp",
				type: "ACID",
				damage: 1,
				duration: -1,
				gridPosition: { col: 0, row: 2 },
				size: { cols: sewerBounds.cols, rows: 3 },
			},
		},
		onWinSceneId: QUEST_3_IRONHOLD_SUMP.scenes.victory,
		gridSize: sewerBounds,
	},
	[QUEST_3_IRONHOLD_SUMP.encounters.riverbend_village]: {
		id: QUEST_3_IRONHOLD_SUMP.encounters.riverbend_village,
		name: "Riverbend Village",
		generateMonsters: () => [
			{
				...giantToad,
				gridPosition: { col: 4, row: 5 },
			},
		],
		generateSummons: () => [],
		surfaces: {},
		gridSize: villageBounds,
	},
};
