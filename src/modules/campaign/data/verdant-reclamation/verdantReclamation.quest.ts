import { townLocationId } from "@/modules/towns/domain/towns.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import { type Quest, questId, questStepId } from "../../domain/quests.type";
import { sceneId } from "../../domain/scenes.type";

export const VERDANT_RECLAMATION_QUEST_ID = questId("verdant_reclamation");

export const VERDANT_RECLAMATION_QUEST: Quest = {
	id: VERDANT_RECLAMATION_QUEST_ID,
	title: "The Verdant Reclamation",
	loreDescription:
		"The lumberjacks of Ironhold have pushed too far into the Whisperwood. The forest is pushing back.",
	initialStepId: questStepId("investigate_camp"),
	steps: {
		[questStepId("investigate_camp")]: {
			id: questStepId("investigate_camp"),
			logDescription:
				"Respond to the distress signal from the Dragon's Tooth Logging Camp.",
			targetNodeId: [{ mapNodeId: mapNodeId("peaks_logging_camp") }],
			onEnterSceneId: sceneId("invasion_start"),
		},
		[questStepId("report_attack")]: {
			id: questStepId("report_attack"),
			logDescription:
				"The elves have attacked the logging camp. Report back to King Tanotalos II in Ironhold.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("ironhold_city"),
					locationId: townLocationId("ironhold_throne"),
				},
			],
			onEnterSceneId: sceneId("meeting_the_king"),
		},
		[questStepId("the_ultimatum")]: {
			id: questStepId("the_ultimatum"),
			logDescription: "Intercept the Elven forces at the Kiven River Bridge.",
			targetNodeId: [{ mapNodeId: mapNodeId("kiven_river_bridge") }],
			onEnterSceneId: sceneId("elven_ultimatum"),
		},
		// BRANCH A: Stop the invasion then Defend the City
		[questStepId("stop_invasion_N_W_S")]: {
			id: questStepId("stop_invasion"),
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the three elven armies.",
			targetNodeId: [
				{ mapNodeId: mapNodeId("northern_treant_army") },
				{ mapNodeId: mapNodeId("western_weavers_army") },
				{ mapNodeId: mapNodeId("southern_beastmaster_army") },
			],
		},
		[questStepId("stop_invasion_N_S")]: {
			id: questStepId("stop_invasion"),
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the two remaining elven armies.",
			targetNodeId: [
				{ mapNodeId: mapNodeId("northern_treant_army") },
				{ mapNodeId: mapNodeId("southern_beastmaster_army") },
			],
		},
		[questStepId("stop_invasion_N_W")]: {
			id: questStepId("stop_invasion"),
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the two remaining elven armies.",
			targetNodeId: [
				{ mapNodeId: mapNodeId("northern_treant_army") },
				{ mapNodeId: mapNodeId("western_weavers_army") },
			],
		},
		[questStepId("stop_invasion_W_S")]: {
			id: questStepId("stop_invasion"),
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the two remaining elven armies.",
			targetNodeId: [
				{ mapNodeId: mapNodeId("western_weavers_army") },
				{ mapNodeId: mapNodeId("southern_beastmaster_army") },
			],
		},
		[questStepId("stop_invasion_N")]: {
			id: questStepId("stop_invasion"),
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the last elven armies.",
			targetNodeId: [{ mapNodeId: mapNodeId("kiven_river_bridge") }],
		},
		[questStepId("stop_invasion_W")]: {
			id: questStepId("stop_invasion"),
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the last elven armies.",
			targetNodeId: [{ mapNodeId: mapNodeId("kiven_river_bridge") }],
		},
		[questStepId("stop_invasion_S")]: {
			id: questStepId("stop_invasion"),
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the last elven armies.",
			targetNodeId: [{ mapNodeId: mapNodeId("kiven_river_bridge") }],
		},
		// BRANCH A: Defend the City
		[questStepId("defend_ironhold")]: {
			id: questStepId("defend_ironhold"),
			logDescription:
				"The Briar Host is at the gates! Return to Ironhold and defend the King.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("ironhold_city"),
					locationId: townLocationId("siege_gates"),
				},
				{
					mapNodeId: mapNodeId("ironhold_city"),
					locationId: townLocationId("siege_tavern"),
				},
				{
					mapNodeId: mapNodeId("ironhold_city"),
					locationId: townLocationId("siege_keep"),
				},
			],
		},
		// BRANCH B: Join the Forest
		[questStepId("assault_ironhold")]: {
			id: questStepId("assault_ironhold"),
			logDescription:
				"You have joined the Briar Host. March on Ironhold and dethrone the King.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("ironhold_city"),
					locationId: townLocationId("siege_gates"),
				},
				{
					mapNodeId: mapNodeId("ironhold_city"),
					locationId: townLocationId("siege_tavern"),
				},
				{
					mapNodeId: mapNodeId("ironhold_city"),
					locationId: townLocationId("siege_keep"),
				},
			],
		},
		// FINAL BATTLE: Defend or Assault the throne room
	},
};
