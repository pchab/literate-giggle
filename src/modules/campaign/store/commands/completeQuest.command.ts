import type { Quest } from "../../domain/quests.type";
import type { CampaignStoreServerAction } from "../campaign.store";

export default function completeQuest(
	questId: Quest["id"],
): CampaignStoreServerAction {
	return ({ activeQuests, completedQuests }) => {
		const newActive = { ...activeQuests };
		delete newActive[questId];

		return {
			activeQuests: newActive,
			completedQuests: completedQuests.includes(questId)
				? completedQuests
				: [...completedQuests, questId],
		};
	};
}
