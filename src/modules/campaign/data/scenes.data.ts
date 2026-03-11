import { type Scene, sceneId } from "../domain/scenes.type";
import { DWARVEN_PASSAGE_SCENE_DB } from "./dwarven-passage/dwarvenPassage.scenes";
import { NECROMANCER_SCENE_DB } from "./necromancer/necromancer.scenes";
import { generateTavernGenericScene } from "./tavern.data";
import { VERDANT_RECLAMATION_SCENE_DB } from "./verdant-reclamation/verdantReclamation.scenes";

export const SCENE_DB: Record<Scene["id"], Scene> = {
	// Taverns
	...generateTavernGenericScene("ironhold_tavern", "/scenes/rusty_boar_tavern.jpg"),
	...generateTavernGenericScene("cromee_tavern", "/scenes/generic_tavern.jpg"),
	...generateTavernGenericScene("connury_tavern", "/scenes/generic_tavern_2.jpg"),

	...VERDANT_RECLAMATION_SCENE_DB,
	...NECROMANCER_SCENE_DB,
	...DWARVEN_PASSAGE_SCENE_DB,
};
