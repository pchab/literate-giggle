import { QUEST_DB } from "../../data/quests.data";
import type { Quest, QuestStep } from "../../domain/quests.type";
import type { CampaignStoreServerAction } from "../campaign.store";

export default function advanceQuest(
	questId: Quest["id"],
	stepId: QuestStep["id"],
): CampaignStoreServerAction {
	return ({ activeQuests }) => {
		const quest = QUEST_DB[questId];
		if (!quest) return {};

		return {
			activeQuests: {
				...activeQuests,
				[questId]: stepId,
			},
		};
	};
}
