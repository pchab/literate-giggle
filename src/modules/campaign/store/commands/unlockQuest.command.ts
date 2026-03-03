import { QUEST_DB } from "../../data/quests.data";
import type { Quest } from "../../domain/quests.type";
import type { CampaignStoreServerAction } from "../campaign.store";

export default function unlockQuest(
	questId: Quest["id"],
): CampaignStoreServerAction {
	return ({ activeQuests }) => {
		const quest = QUEST_DB[questId];
		if (!quest) return {};

		return {
			activeQuests: {
				...activeQuests,
				[questId]: quest.initialStepId,
			},
		};
	};
}
