import { getCellId } from "@/modules/battle/helpers/grid.helpers";
import type { BattleState } from "@/modules/battle/store/battle.store";
import { giantToad } from "@/modules/figures/data/monsters/giant-toad";
import { smugglerCrate } from "@/modules/figures/data/summons/smugglersCrate";
import { isHero, isSummon } from "@/modules/figures/helpers/figures.helpers";
import type { Encounter } from "../../domain/encounters.type";
import { QUEST_3_IRONHOLD_SUMP } from "./sewerContamination.definitions";

const sewerBounds = { cols: 7, rows: 7 };
const villageBounds = { cols: 12, rows: 8 };
const REQUIRED_SURVIVORS = 2;
const ESCAPE_COLUMN = 11;

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
				type: "HAZARD",
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
				gridPosition: { col: 9, row: 5 },
			},
		],
		generateSummons: () => [
			// {
			// 	...villagerBlueprint,
			// 	gridPosition: { col: 2, row: 2 },
			// 	allegiance: "NEUTRAL",
			// },
			// {
			// 	...villagerBlueprint,
			// 	gridPosition: { col: 2, row: 5 },
			// 	allegiance: "NEUTRAL",
			// },
			// {
			// 	...villagerBlueprint,
			// 	gridPosition: { col: 3, row: 3 },
			// 	allegiance: "NEUTRAL",
			// },
		],
		surfaces: {
			[getCellId({ col: 5, row: 0 })]: {
				id: getCellId({ col: 5, row: 0 }),
				spriteBase: "/surfaces/river_1.webp",
				type: "HAZARD",
				damage: 999,
				duration: -1,
				gridPosition: { col: 5, row: 0 },
				size: { cols: 2, rows: 3 },
			},
			[getCellId({ col: 5, row: 3 })]: {
				id: getCellId({ col: 5, row: 3 }),
				spriteBase: "/surfaces/bridge.webp",
				type: "TERRAIN",
				damage: 0,
				duration: -1,
				gridPosition: { col: 5, row: 3 },
				size: { cols: 2, rows: 2 },
			},
			[getCellId({ col: 5, row: 5 })]: {
				id: getCellId({ col: 5, row: 5 }),
				spriteBase: "/surfaces/river_2.webp",
				type: "HAZARD",
				damage: 999,
				duration: -1,
				gridPosition: { col: 5, row: 5 },
				size: { cols: 2, rows: 3 },
			},
		},
		checkWin: (state: BattleState) => {
			const safeVillagers = state.units.filter(
				(u) =>
					isSummon(u) &&
					u.allegiance === "NEUTRAL" &&
					u.gridPosition.col >= ESCAPE_COLUMN,
			);
			return safeVillagers.length >= REQUIRED_SURVIVORS;
		},

		checkLoss: (state: BattleState) => {
			// 1. Did the heroes wipe?
			const heroesAlive = state.units.filter((u) => isHero(u)).length > 0;
			if (!heroesAlive) return true;

			// 2. Did too many villagers fall in the river or get eaten?
			const livingVillagers = state.units.filter(
				(u) => isSummon(u) && u.allegiance === "NEUTRAL",
			).length;
			if (livingVillagers < REQUIRED_SURVIVORS) return true;

			return false;
		},
		gridSize: villageBounds,
	},
};
