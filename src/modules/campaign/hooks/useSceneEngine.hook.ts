import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { SceneAction } from "@/modules/campaign/domain/scenes.type";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { useWorldStore } from "@/modules/world/store/world.store";

export function useSceneEngine(setLocalStep: (stepId: string) => void) {
	const router = useRouter();

	const { advanceQuest, completeQuest, setActiveSceneId } = useCampaignStore(
		useShallow((state) => ({
			advanceQuest: state.advanceQuest,
			completeQuest: state.completeQuest,
			setActiveSceneId: state.setActiveSceneId,
		})),
	);
	const { setPhase, roster } = useWorldStore(
		useShallow((state) => ({
			setPhase: state.setPhase,
			roster: state.roster,
		})),
	);
	const { initBattle } = useBattleStore(
		useShallow((state) => ({
			initBattle: state.initBattle,
		})),
	);

	const processActions = (actions: SceneAction[]) => {
		actions.forEach((action) => {
			switch (action.type) {
				// --- CAMPAIGN STATE MUTATIONS ---
				case "ADVANCE_QUEST":
					advanceQuest(action.questId, action.newStepId);
					break;
				case "COMPLETE_QUEST":
					completeQuest(action.questId);
					break;
				case "CHANGE_STEP":
					setLocalStep(action.stepId);
					break;

				// --- WORLD/ROSTER MUTATIONS ---
				case "UPGRADE_CLASS_CARDS":
					// TEMP
					console.log(
						`[Narrative Reward] Upgrading ${action.heroClass} cards!`,
					);
					break;

				// --- ROUTING & SIDE EFFECTS ---
				case "START_BATTLE":
					setActiveSceneId(null);
					initBattle(roster, action.encounterId, action.background);
					setPhase("BATTLE");
					router.push("/battle");
					break;
				case "START_SCENE":
					setActiveSceneId(action.sceneId);
					router.push(`/scene/${action.sceneId}`);
					break;
				case "END_SCENE":
					setActiveSceneId(null);
					setPhase("MAP");
					router.push("/");
					break;

				default:
					console.warn("Unknown scene action:", action);
			}
		});
	};

	return { processActions };
}
