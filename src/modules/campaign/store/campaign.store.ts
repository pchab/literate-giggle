import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { QUEST_DB } from "@/modules/campaign/data/quests.data";
import type { Quest, QuestStep } from "@/modules/campaign/domain/quests.type";
import type { Scene } from "@/modules/campaign/domain/scenes.type";
import type { MapNode } from "@/modules/world/domain/map.types";
import advanceQuest from "./commands/advanceQuest.command";
import completeQuest from "./commands/completeQuest.command";
import unlockQuest from "./commands/unlockQuest.command";

export type NodeOverrides = {
	onEnter?: Scene["id"];
	onWin?: Scene["id"];
};

interface CampaignState {
	activeQuests: Record<Quest["id"], QuestStep["id"]>;
	completedQuests: Quest["id"][];
	nodeOverrides: Record<MapNode["id"], NodeOverrides>;
	activeSceneId: Scene["id"] | null;
}

interface CampaignActions {
	unlockQuest: (questId: Quest["id"]) => void;
	advanceQuest: (questId: Quest["id"], stepId: QuestStep["id"]) => void;
	completeQuest: (questId: Quest["id"]) => void;
	getOverride: (
		nodeId: MapNode["id"],
		hook: "onEnter" | "onWin",
	) => Scene["id"] | null;
	setActiveSceneId: (sceneId: Scene["id"] | null) => void;
}

const initialState: CampaignState = {
	activeQuests: {},
	completedQuests: [],
	nodeOverrides: {},
	activeSceneId: null,
};

export type CampaignStoreServerAction = (
	state: CampaignState & CampaignActions,
) => Partial<CampaignState>;

export const useCampaignStore = create<CampaignState & CampaignActions>()(
	persist(
		(set, get) => ({
			...initialState,

			unlockQuest: (questId) => set(unlockQuest(questId)),

			advanceQuest: (questId, stepId) => set(advanceQuest(questId, stepId)),

			completeQuest: (questId) => set(completeQuest(questId)),

			getOverride: (nodeId: MapNode["id"], hook: "onEnter" | "onWin") => {
				const { activeQuests } = get();
				for (const [qId, currentStepId] of Object.entries(activeQuests)) {
					const quest = QUEST_DB[qId as Quest["id"]];
					const step = quest?.steps[currentStepId as QuestStep["id"]];

					if (step && step.targetNodeId === nodeId) {
						if (hook === "onEnter" && step.onEnterSceneId)
							return step.onEnterSceneId;
						if (hook === "onWin" && step.onWinSceneId) return step.onWinSceneId;
					}
				}

				return null;
			},

			setActiveSceneId: (sceneId) => set({ activeSceneId: sceneId }),
		}),
		{
			name: "alpha-campaign-state",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
