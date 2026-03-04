import { Scene, sceneId } from "../../domain/scenes.type";
import { questStepId } from "../../domain/quests.type";
import { VERDANT_RECLAMATION_QUEST_ID } from "./verdantReclamation.quest";

export const VERDANT_RECLAMATION_SCENE_DB: Record<Scene["id"], Scene> = {
    [sceneId("invasion_start")]: {
        id: sceneId("invasion_start"),
        initialStepId: "intro",
        steps: {
            intro: {
                speaker: "Wounded Lumberjack",
                text: "You're too late... The trees, they just ripped themselves out of the earth. The Elves of the Briar Host are marching on Ironhold!",
                backgroundImage: "/bgs/logging_camp_ruins.jpg",
                choices: [
                    {
                        label: "Return to the city. We must prepare the defenses.",
                        actions: [
                            { type: "ADVANCE_QUEST", questId: VERDANT_RECLAMATION_QUEST_ID, newStepId: questStepId("the_three_fronts") },
                            { type: "END_SCENE" }
                        ]
                    }
                ]
            }
        }
    }
};