import { townLocationId } from "@/modules/towns/domain/towns.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import { type Quest, questId, questStepId } from "../../domain/quests.type";
import { sceneId } from "../../domain/scenes.type";

export const VERDANT_RECLAMATION = {
	id: questId("verdant_reclamation"),
	steps: {
		war_rumors: questStepId("war_rumors"),
		investigate_camp: questStepId("investigate_camp"),
		report_attack: questStepId("report_attack"),
		the_ultimatum: questStepId("the_ultimatum"),
		stop_invasion_N_W_S: questStepId("stop_invasion_N_W_S"),
		stop_invasion_N_S: questStepId("stop_invasion_N_S"),
		stop_invasion_N_W: questStepId("stop_invasion_N_W"),
		stop_invasion_W_S: questStepId("stop_invasion_W_S"),
		stop_invasion_N: questStepId("stop_invasion_N"),
		stop_invasion_W: questStepId("stop_invasion_W"),
		stop_invasion_S: questStepId("stop_invasion_S"),
		defend_ironhold: questStepId("defend_ironhold"),
		assault_ironhold: questStepId("assault_ironhold"),
	},
} as const;

export const VERDANT_RECLAMATION_QUEST: Quest = {
	id: VERDANT_RECLAMATION.id,
	title: "The Verdant Reclamation",
	loreDescription:
		"The lumberjacks of Ironhold have pushed too far into the Whisperwood. The forest is pushing back.",
	initialStepId: VERDANT_RECLAMATION.steps.investigate_camp,
	steps: {
		[VERDANT_RECLAMATION.steps.war_rumors]: {
			id: VERDANT_RECLAMATION.steps.war_rumors,
			logDescription: "Investigate rumors at the Ironhold tavern.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("ironhold_city"),
					locationId: townLocationId("ironhold_tavern"),
				},
			],
			onEnterSceneId: sceneId("invasion_start"),
		},
		[VERDANT_RECLAMATION.steps.investigate_camp]: {
			id: VERDANT_RECLAMATION.steps.investigate_camp,
			logDescription:
				"Respond to the distress signal from the Dragon's Tooth Logging Camp.",
			targetNodeId: [{ mapNodeId: mapNodeId("peaks_logging_camp") }],
			onEnterSceneId: sceneId("invasion_start"),
		},
		[VERDANT_RECLAMATION.steps.report_attack]: {
			id: VERDANT_RECLAMATION.steps.report_attack,
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
		[VERDANT_RECLAMATION.steps.the_ultimatum]: {
			id: VERDANT_RECLAMATION.steps.the_ultimatum,
			logDescription: "Intercept the Elven forces at the Kiven River Bridge.",
			targetNodeId: [{ mapNodeId: mapNodeId("kiven_river_bridge") }],
			onEnterSceneId: sceneId("elven_ultimatum"),
		},
		// BRANCH A: Stop the invasion then Defend the City
		[VERDANT_RECLAMATION.steps.stop_invasion_N_W_S]: {
			id: VERDANT_RECLAMATION.steps.stop_invasion_N_W_S,
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the three elven armies.",
			targetNodeId: [
				{ mapNodeId: mapNodeId("northern_treant_army") },
				{ mapNodeId: mapNodeId("western_weavers_army") },
				{ mapNodeId: mapNodeId("southern_beastmaster_army") },
			],
		},
		[VERDANT_RECLAMATION.steps.stop_invasion_N_S]: {
			id: VERDANT_RECLAMATION.steps.stop_invasion_N_S,
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the two remaining elven armies.",
			targetNodeId: [
				{ mapNodeId: mapNodeId("northern_treant_army") },
				{ mapNodeId: mapNodeId("southern_beastmaster_army") },
			],
		},
		[VERDANT_RECLAMATION.steps.stop_invasion_N_W]: {
			id: VERDANT_RECLAMATION.steps.stop_invasion_N_W,
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the two remaining elven armies.",
			targetNodeId: [
				{ mapNodeId: mapNodeId("northern_treant_army") },
				{ mapNodeId: mapNodeId("western_weavers_army") },
			],
		},
		[VERDANT_RECLAMATION.steps.stop_invasion_W_S]: {
			id: VERDANT_RECLAMATION.steps.stop_invasion_W_S,
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the two remaining elven armies.",
			targetNodeId: [
				{ mapNodeId: mapNodeId("western_weavers_army") },
				{ mapNodeId: mapNodeId("southern_beastmaster_army") },
			],
		},
		[VERDANT_RECLAMATION.steps.stop_invasion_N]: {
			id: VERDANT_RECLAMATION.steps.stop_invasion_N,
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the last elven armies.",
			targetNodeId: [{ mapNodeId: mapNodeId("kiven_river_bridge") }],
		},
		[VERDANT_RECLAMATION.steps.stop_invasion_W]: {
			id: VERDANT_RECLAMATION.steps.stop_invasion_W,
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the last elven armies.",
			targetNodeId: [{ mapNodeId: mapNodeId("kiven_river_bridge") }],
		},
		[VERDANT_RECLAMATION.steps.stop_invasion_S]: {
			id: VERDANT_RECLAMATION.steps.stop_invasion_S,
			logDescription:
				"The Briar Host is invading our land. Stop the progress of the last elven armies.",
			targetNodeId: [{ mapNodeId: mapNodeId("kiven_river_bridge") }],
		},
		// BRANCH A: Defend the City
		[VERDANT_RECLAMATION.steps.defend_ironhold]: {
			id: VERDANT_RECLAMATION.steps.defend_ironhold,
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
		[VERDANT_RECLAMATION.steps.assault_ironhold]: {
			id: VERDANT_RECLAMATION.steps.assault_ironhold,
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
