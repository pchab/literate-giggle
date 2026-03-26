import { giantToad } from "@/modules/figures/data/monsters/giant-toad";
import type { Encounter } from "../../domain/encounters.type";
import { SEWER_CONTAMINATION } from "./sewerContamination.definitions";

export const sewerContaminationEncounters: Record<string, Encounter> = {
	[SEWER_CONTAMINATION.encounters.giant_toad]: {
		id: SEWER_CONTAMINATION.encounters.giant_toad,
		name: "Giant Toad",
		generateMonsters: () => [
			{
				...giantToad,
				gridPosition: { col: 3, row: 3 },
			},
		],
	},
};
