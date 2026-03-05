import { useShallow } from "zustand/shallow";
import type { CampaignCondition } from "@/modules/world/domain/map.types";
import { useCampaignStore } from "../store/campaign.store";

export function useCheckConditions() {
	const { activeQuests, completedQuests, flags } = useCampaignStore(
		useShallow((state) => ({
			activeQuests: state.activeQuests,
			completedQuests: state.completedQuests,
			flags: state.flags,
		})),
	);

	const isConditionMet = (condition?: CampaignCondition) => {
		if (!condition) return true;

		switch (condition.type) {
			case "QUEST_COMPLETED":
				return completedQuests.includes(condition.questId);
			case "QUEST_ACTIVE": {
				const activeStep = activeQuests[condition.questId];
				if (!activeStep) return false;
				if (condition.stepId) {
					return condition.stepId.includes(activeStep);
				}
				return true;
			}
			case "HAS_FLAG":
				return flags.includes(condition.flagId);
			default:
				return false;
		}
	};

	return isConditionMet;
}
