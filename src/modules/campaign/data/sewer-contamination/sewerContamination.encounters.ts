import { giantToad } from "@/modules/figures/data/monsters/giant-toad";
import type { Encounter } from "../../domain/encounters.type";
import { QUEST_3_IRONHOLD_SUMP } from "./sewerContamination.definitions";

export const sewerContaminationEncounters: Record<string, Encounter> = {
	[QUEST_3_IRONHOLD_SUMP.encounters.giant_toad]: {
		id: QUEST_3_IRONHOLD_SUMP.encounters.giant_toad,
		name: "Giant Toad",
		generateMonsters: () => [
			{
				...giantToad,
				gridPosition: { col: 3, row: 3 },
			},
		],
	},
};
