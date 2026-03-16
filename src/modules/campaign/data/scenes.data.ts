import { type Scene, sceneId } from "../domain/scenes.type";
import { DWARVEN_PASSAGE_SCENE_DB } from "./dwarven-passage/dwarvenPassage.scenes";
import { NECROMANCER_SCENE_DB } from "./necromancer/necromancer.scenes";
import { RATS_IN_THE_CELLAR_SCENES } from "./rats-in-the-cellar/ratsInTheCellar.scenes";
import { generateTavernGenericScene } from "./tavern.data";
import { VERDANT_RECLAMATION_SCENE_DB } from "./verdant-reclamation/verdantReclamation.scenes";

export const SCENE_DB: Record<Scene["id"], Scene> = {
	// Taverns
	...generateTavernGenericScene(
		"ironhold_tavern",
		"/scenes/rusty_boar_tavern.webp",
	),
	...generateTavernGenericScene("cromee_tavern", "/scenes/generic_tavern.webp"),
	...generateTavernGenericScene(
		"connury_tavern",
		"/scenes/generic_tavern_2.webp",
	),

	[sceneId("access_denied_throne_room")]: {
		id: sceneId("access_denied_throne_room"),
		initialStepId: "denied",
		steps: {
			denied: {
				speaker: "Royal Guard",
				text: "Halt! The throne room is off-limits to civilians.",
				backgroundImage: "/scenes/ironhold_throne_room.webp",
				choices: [
					{
						label: "Get out.",
						actions: [{ type: "END_SCENE" }],
					},
				],
			},
		},
	},

	...RATS_IN_THE_CELLAR_SCENES,
	...VERDANT_RECLAMATION_SCENE_DB,
	...NECROMANCER_SCENE_DB,
	...DWARVEN_PASSAGE_SCENE_DB,
};
