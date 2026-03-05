import type { Quest } from "../domain/quests.type";
import {
	VERDANT_RECLAMATION_QUEST,
	VERDANT_RECLAMATION_QUEST_ID,
} from "./verdant-reclamation/verdantReclamation.quest";

export const QUEST_DB: Record<Quest["id"], Quest> = {
	[VERDANT_RECLAMATION_QUEST_ID]: VERDANT_RECLAMATION_QUEST,
};
