import type { Quest } from "@/modules/campaign/domain/quests.type";
import { townLocationId } from "@/modules/towns/domain/towns.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import { SEWER_CONTAMINATION } from "./sewerContamination.definitions";

export const sewerContaminationQuest: Quest = {
	id: SEWER_CONTAMINATION.id,
	title: "The Ironhold Sump",
	loreDescription:
		"Barnaby's ledger revealed that a massive shipment of mutagen was smuggled back into Ironhold. The trail leads into the city's ancient sewer system.",
	initialStepId: SEWER_CONTAMINATION.steps.investigate,
	steps: {
		[SEWER_CONTAMINATION.steps.investigate]: {
			id: SEWER_CONTAMINATION.steps.investigate,
			logDescription:
				"Search the Ironhold Sewers for the smuggled mutagen crates.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("ironhold"),
					locationId: townLocationId("sewers"),
				},
			],
			onEnterSceneId: SEWER_CONTAMINATION.scenes.intro,
		},
		[SEWER_CONTAMINATION.steps.travel_to_village]: {
			id: SEWER_CONTAMINATION.steps.travel_to_village,
			logDescription:
				"You decided to rush to the Riverbend village to try and save them from the mutagen contamination.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("riverbend_village"),
				},
			],
			onEnterSceneId: SEWER_CONTAMINATION.scenes.riverbend_arrival,
		},
	},
};
