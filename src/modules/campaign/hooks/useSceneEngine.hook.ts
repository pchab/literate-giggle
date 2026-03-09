import { redirect } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { SceneAction } from "@/modules/campaign/domain/scenes.type";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { useDynamicMap } from "@/modules/world/hooks/useDynamicMap";
import { useWorldStore } from "@/modules/world/store/world.store";

export function useSceneEngine(setLocalStep: (stepId: string) => void) {
	const { advanceQuest, completeQuest, setActiveSceneId, flags, setFlag } =
		useCampaignStore(
			useShallow((state) => ({
				advanceQuest: state.advanceQuest,
				completeQuest: state.completeQuest,
				setActiveSceneId: state.setActiveSceneId,
				flags: state.flags,
				setFlag: state.setFlag,
			})),
		);
	const { currentNodeId, setPhase, roster, rewardEvoRune, travelToNode } =
		useWorldStore(
			useShallow((state) => ({
				currentNodeId: state.currentNodeId,
				setPhase: state.setPhase,
				roster: state.roster,
				rewardEvoRune: state.rewardEvoRune,
				travelToNode: state.travelToNode,
			})),
		);
	const { initBattle } = useBattleStore(
		useShallow((state) => ({
			initBattle: state.initBattle,
		})),
	);
	const dynamicMap = useDynamicMap();

	const processActions = (actions: SceneAction[]) => {
		actions.forEach((action) => {
			switch (action.type) {
				// --- CAMPAIGN STATE MUTATIONS ---
				case "ADVANCE_QUEST":
					advanceQuest(action.questId, action.newStepId);
					break;
				case "ADVANCE_IF_FLAGS": {
					const hasRequiredFlags = action.requiredFlags.every((flag) =>
						flags.includes(flag),
					);
					if (hasRequiredFlags) {
						advanceQuest(action.questId, action.newStepId);
					}
					break;
				}
				case "COMPLETE_QUEST":
					completeQuest(action.questId);
					break;
				case "CHANGE_STEP":
					setLocalStep(action.stepId);
					break;
				case "SET_FLAG":
					setFlag(action.flagId);
					break;
				case "REWARD_EVO_RUNE":
					rewardEvoRune(action.evoRune);
					break;
				case "FORCE_MOVE":
					travelToNode(action.nodeId, dynamicMap);
					break;

				// --- ROUTING & SIDE EFFECTS ---
				case "START_BATTLE":
					setActiveSceneId(null);
					initBattle(roster, action.encounterId, action.background);
					setPhase("BATTLE");
					redirect("/battle");
					break;
				case "START_SCENE":
					setActiveSceneId(action.sceneId);
					redirect(`/scene/${action.sceneId}`);
					break;
				case "END_SCENE":
					setActiveSceneId(null);
					setPhase(dynamicMap[currentNodeId].type === "TOWN" ? "TOWN" : "MAP");
					redirect("/");
					break;

				default:
					console.warn("Unknown scene action:", action);
			}
		});
	};

	return { processActions };
}
