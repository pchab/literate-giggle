import { encounterId } from "@/modules/campaign/domain/encounters.type";
import { questId } from "@/modules/campaign/domain/quests.type";

export const SEWER_CONTAMINATION = {
	id: questId("sewer_contamination"),
	encounters: {
		giant_toad: encounterId("giant_toad"),
	},
} as const;
