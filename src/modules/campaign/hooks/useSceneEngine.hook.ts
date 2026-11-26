import { redirect } from "next/navigation";
import { useShallow } from "zustand/shallow";
import type { SceneAction } from "@/modules/campaign/domain/scenes.type";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { getDynamicMap } from "@/modules/world/hooks/useDynamicMap";
import { useWorldStore } from "@/modules/world/store/world.store";

export function useSceneEngine(setLocalStep: (stepId: string) => void) {
	const { advanceQuest, completeQuest, setActiveSceneId, setFlag, clearFlag } =
		useCampaignStore(
			useShallow((state) => ({
				advanceQuest: state.advanceQuest,
				completeQuest: state.completeQuest,
				setActiveSceneId: state.setActiveSceneId,
				setFlag: state.setFlag,
				clearFlag: state.clearFlag,
			})),
		);
	// Read flags fresh: earlier actions in the same list may have just set one.
	const hasFlag = (flag: string) =>
		useCampaignStore.getState().flags.includes(flag);
	const { setPhase, rewardEvoRune, travelToNode, healParty } = useWorldStore(
		useShallow((state) => ({
			setPhase: state.setPhase,
			roster: state.roster,
			rewardEvoRune: state.rewardEvoRune,
			travelToNode: state.travelToNode,
			healParty: state.healParty,
		})),
	);

	const processActions = (actions: SceneAction[]): void => {
		actions.forEach((action) => {
			switch (action.type) {
				// --- CAMPAIGN STATE MUTATIONS ---
				case "ADVANCE_QUEST":
					advanceQuest(action.questId, action.newStepId);
					break;
				case "ADVANCE_IF_FLAGS": {
					const hasRequiredFlags = action.requiredFlags.every(hasFlag);
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
				case "CLEAR_FLAG":
					clearFlag(action.flagId);
					break;
				case "IF_FLAGS": {
					const ok =
						(action.all ?? []).every(hasFlag) &&
						!(action.none ?? []).some(hasFlag);
					processActions(ok ? action.actions : (action.otherwise ?? []));
					break;
				}
				case "HEAL_PARTY":
					healParty(action.amount);
					break;
				case "REWARD_EVO_RUNE":
					rewardEvoRune(action.evoRune);
					break;
				case "FORCE_MOVE":
					// Fresh map: this scene may have just unlocked the destination.
					travelToNode(action.nodeId, getDynamicMap());
					break;

				// --- ROUTING & SIDE EFFECTS ---
				case "START_BATTLE":
					setActiveSceneId(null);
					setPhase("BATTLE");
					redirect(
						`/battle/${action.encounterId}?background=${action.background}`,
					);
					break;
				case "START_SCENE":
					setActiveSceneId(action.sceneId);
					redirect(`/scenes/${action.sceneId}`);
					break;
				case "END_SCENE":
					setActiveSceneId(null);
					{
						// Fresh node: a FORCE_MOVE earlier in this list may have moved the party.
						const { currentNodeId } = useWorldStore.getState();
						const node = getDynamicMap()[currentNodeId];
						setPhase(node?.type === "TOWN" ? "TOWN" : "MAP");
					}
					redirect("/");
					break;

				default:
					console.warn("Unknown scene action:", action);
			}
		});
	};

	return { processActions };
}
