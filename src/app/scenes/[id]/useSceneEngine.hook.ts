import { useRouter } from "next/navigation";
import type { SceneAction } from "@/modules/quests/domain/scenes.type";
import { useBattleStore } from "@/store/battle.store";
import { useCampaignStore } from "@/store/campaign.store";
import { useWorldStore } from "@/store/world.store";
import { useShallow } from "zustand/shallow";

export function useSceneEngine(setLocalStep: (stepId: string) => void) {
    const router = useRouter();

    const { advanceQuest, completeQuest, setActiveSceneId } = useCampaignStore(useShallow((state) => ({
        advanceQuest: state.advanceQuest,
        completeQuest: state.completeQuest,
        setActiveSceneId: state.setActiveSceneId,
    })));
    const { setPhase, roster, travelToNode } = useWorldStore(useShallow((state) => ({
        setPhase: state.setPhase,
        roster: state.roster,
		travelToNode: state.travelToNode,
    })));
    const { initBattle } = useBattleStore(useShallow((state) => ({
        initBattle: state.initBattle,
    })));

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