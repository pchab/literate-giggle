import type { SurfaceData } from "@/modules/battle/domain/grid.type";
import { GRID_BOUNDS, getCellId } from "@/modules/battle/helpers/grid.helpers";
import { giantToad } from "@/modules/figures/data/monsters/giant-toad";
import { smugglerCrate } from "@/modules/figures/data/summons/smugglersCrate";
import type { Encounter } from "../../domain/encounters.type";
import { QUEST_3_IRONHOLD_SUMP } from "./sewerContamination.definitions";

const baseAcidSurface: Omit<SurfaceData, "position"> = {
	spriteBase: "/surfaces/acid.webp",
	type: "ACID",
	damage: 2,
	duration: -1,
};
const generateSewerArena = (): Record<string, SurfaceData> => {
	const surfaces: Record<string, SurfaceData> = {};

	for (let row = 0; row < GRID_BOUNDS.rows; row++) {
		const mainCol = 3;
		const offsetCol = 2;

		surfaces[getCellId({ col: mainCol, row })] = {
			position: { col: mainCol, row },
			...baseAcidSurface,
		};
		surfaces[getCellId({ col: offsetCol, row })] = {
			position: { col: offsetCol, row },
			...baseAcidSurface,
		};
	}
	return surfaces;
};

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
				gridPosition: { col: 1, row: 3 },
				allegiance: "NEUTRAL",
			},
			{
				...smugglerCrate,
				id: "crate_2",
				gridPosition: { col: 1, row: 4 },
				allegiance: "NEUTRAL",
			},
			{
				...smugglerCrate,
				id: "crate_3",
				gridPosition: { col: 5, row: 3 },
				allegiance: "NEUTRAL",
			},
			{
				...smugglerCrate,
				id: "crate_4",
				gridPosition: { col: 5, row: 4 },
				allegiance: "NEUTRAL",
			},
		],
		surfaces: generateSewerArena(),
		onWinSceneId: QUEST_3_IRONHOLD_SUMP.scenes.victory,
	},
};
