import type { MapNode } from "@/modules/world/domain/map.types";
import { QUEST_DB } from "../../data/quests.data";
import type { Quest, QuestStep } from "../../domain/quests.type";
import type { CampaignState } from "../campaign.store";

export const getOverride =
	(get: () => CampaignState) =>
	(nodeId: MapNode["id"], hook: "onEnter" | "onWin") => {
		const { activeQuests } = get();
		for (const [qId, currentStepId] of Object.entries(activeQuests)) {
			const quest = QUEST_DB[qId as Quest["id"]];
			const step = quest?.steps[currentStepId as QuestStep["id"]];

			if (
				step?.targetNodeId.some(
					({ mapNodeId, locationId }) => mapNodeId === nodeId && !locationId,
				)
			) {
				if (hook === "onEnter" && step.onEnterSceneId)
					return step.onEnterSceneId;
				if (hook === "onWin" && step.onWinSceneId) return step.onWinSceneId;
			}
		}

		return null;
	};
