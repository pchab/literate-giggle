import type { Scene } from "../domain/scenes.type";
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

	...RATS_IN_THE_CELLAR_SCENES,
	...VERDANT_RECLAMATION_SCENE_DB,
	...NECROMANCER_SCENE_DB,
	...DWARVEN_PASSAGE_SCENE_DB,
};
