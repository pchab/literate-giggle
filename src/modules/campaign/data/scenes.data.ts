import { type Scene, sceneId } from "../domain/scenes.type";
import { DWARVEN_PASSAGE_SCENE_DB } from "./dwarven-passage/dwarvenPassage.scenes";
import { NECROMANCER_SCENE_DB } from "./necromancer/necromancer.scenes";
import { VERDANT_RECLAMATION_SCENE_DB } from "./verdant-reclamation/verdantReclamation.scenes";

export const SCENE_DB: Record<Scene["id"], Scene> = {
	// GENERIC scenes
	[sceneId("generic_tavern")]: {
		id: sceneId("generic_tavern"),
		initialStepId: "intro",
		steps: {
			intro: {
				speaker: "Bartender",
				text: "What can I get you ?",
				backgroundImage: "/scenes/generic_tavern.jpg",
				choices: [
					{
						label: "An ale.",
						actions: [{ type: "END_SCENE" }],
					},
					{
						label: "Nothing.",
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
	...NECROMANCER_SCENE_DB,
	...DWARVEN_PASSAGE_SCENE_DB,
};
