import type { Quest } from "../domain/quests.type";
import {
	VERDANT_RECLAMATION,
	VERDANT_RECLAMATION_QUEST,
} from "./verdant-reclamation/verdantReclamation.quest";

export const QUEST_DB: Record<Quest["id"], Quest> = {
	[VERDANT_RECLAMATION.id]: VERDANT_RECLAMATION_QUEST,
};
