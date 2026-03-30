import type { Quest } from "@/modules/campaign/domain/quests.type";
import { townLocationId } from "@/modules/towns/domain/towns.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import { QUEST_3_IRONHOLD_SUMP } from "./sewerContamination.definitions";

export const ironholdSumpQuest: Quest = {
	id: QUEST_3_IRONHOLD_SUMP.id,
	title: "The Ironhold Sump",
	loreDescription:
		"Barnaby's ledger revealed that a massive shipment of mutagen was smuggled back into Ironhold. The trail leads into the city's ancient sewer system.",
	initialStepId: QUEST_3_IRONHOLD_SUMP.steps.investigate,
	steps: {
		[QUEST_3_IRONHOLD_SUMP.steps.investigate]: {
			id: QUEST_3_IRONHOLD_SUMP.steps.investigate,
			logDescription:
				"Search the Ironhold Sewers for the smuggled mutagen crates.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("ironhold"),
					locationId: townLocationId("sewers"),
				},
			],
			onEnterSceneId: QUEST_3_IRONHOLD_SUMP.scenes.intro,
		},
		[QUEST_3_IRONHOLD_SUMP.steps.resolved]: {
			id: QUEST_3_IRONHOLD_SUMP.steps.resolved,
			logDescription: "You made a fateful choice in the sewers...",
			targetNodeId: [],
		},
	},
};
