import type { Quest } from "../domain/quests.type";
import {
	DWARVEN_PASSAGE_QUEST,
	QUEST_DWARVEN_HIGHWAY,
} from "./dwarven-passage/dwarvenPassage.quest";
import {
	NECROMANCER_QUEST,
	NECROMANCER_QUEST_ID,
} from "./necromancer/necromancer.quest";
import {
	VERDANT_RECLAMATION,
	VERDANT_RECLAMATION_QUEST,
} from "./verdant-reclamation/verdantReclamation.quest";

export const QUEST_DB: Record<Quest["id"], Quest> = {
	[VERDANT_RECLAMATION.id]: VERDANT_RECLAMATION_QUEST,
	[NECROMANCER_QUEST_ID]: NECROMANCER_QUEST,
	[QUEST_DWARVEN_HIGHWAY]: DWARVEN_PASSAGE_QUEST,
};
