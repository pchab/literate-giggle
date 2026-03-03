import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { WorldMapNodes } from "../data/mapNodes.data";
import type { MapNode, CampaignCondition } from "../domain/map.types";
import { useShallow } from "zustand/shallow";

export function useDynamicMap() {
    const { activeQuests, completedQuests } = useCampaignStore(useShallow((state) => ({
        activeQuests: state.activeQuests,
        completedQuests: state.completedQuests,
    })));

    const isConditionMet = (condition?: CampaignCondition) => {
        if (!condition) return true;

        switch (condition.type) {
            case "QUEST_COMPLETED":
                return completedQuests.includes(condition.questId);
            case "QUEST_ACTIVE":
                const activeStep = activeQuests[condition.questId];
                if (!activeStep) return false;
                if (condition.stepId) {
                    if (Array.isArray(condition.stepId)) {
                        if (!condition.stepId.includes(activeStep)) return false;
                    } else {
                        if (activeStep !== condition.stepId) return false;
                    }
                }
                return true;
            default:
                return false;
        }
    };

    const activeMap = Object.values(WorldMapNodes).reduce<Record<string, MapNode>>((acc, baseNode) => {
        if (!isConditionMet(baseNode.unlockCondition)) {
            return acc;
        }

        let finalNode = { ...baseNode };

        if (baseNode.variants) {
            for (const variant of baseNode.variants) {
                if (isConditionMet(variant.condition)) {
                    finalNode = { ...finalNode, ...variant.override };
                }
            }
        }

        acc[finalNode.id] = finalNode;
        return acc;
    }, {});

    return activeMap;
}