import { type Scene, sceneId } from "../domain/scenes.type";
import { VERDANT_RECLAMATION } from "./verdant-reclamation/verdantReclamation.quest";
import { VERDANT_RECLAMATION_SCENE_DB } from "./verdant-reclamation/verdantReclamation.scenes";

export const SCENE_DB: Record<Scene["id"], Scene> = {
	// GENERIC scenes
	[sceneId("generic_tavern")]: {
		id: sceneId("generic_tavern"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Off-Duty Soldier",
				text: "Grab a stool, friend. It's tense in the city today. We lost contact with the Dragon's Tooth Logging Camp three days ago, and the scouts we sent never came back. The Captain is paying good coin for anyone brave enough to go check it out.",
				backgroundImage: "/scenes/generic_tavern.jpg",
				choices: [
					{
						label: "I'll head to the camp and investigate.",
						actions: [
							{
								type: "ADVANCE_QUEST",
								questId: VERDANT_RECLAMATION.id,
								newStepId: VERDANT_RECLAMATION.steps.investigate_camp,
							},
							{ type: "END_SCENE" },
						],
					},
					{
						label: "Sounds dangerous. I just want an ale.",
						actions: [{ type: "END_SCENE" }],
					},
				],
			},
		},
	},

	[sceneId("access_denied_throne_room")]: {
		id: sceneId("access_denied_throne_room"),
		initialStepId: "denied",
		steps: {
			denied: {
				speaker: "Royal Guard",
				text: "Halt! The throne room is off-limits to civilians.",
				backgroundImage: "/scenes/ironhold_throne_room.jpg",
				choices: [
					{
						label: "Get out.",
						actions: [{ type: "END_SCENE" }],
					},
				],
			},
		},
	},

	...VERDANT_RECLAMATION_SCENE_DB,
};
