import { mapNodeId } from "@/modules/world/domain/map.types";
import { Quest, questId } from "../../domain/quests.type";
import { questStepId } from "../../domain/quests.type";
import { sceneId } from "../../domain/scenes.type";

export const VERDANT_RECLAMATION_QUEST_ID = questId("verdant_reclamation");

export const VERDANT_RECLAMATION_QUEST: Quest = {
        id: VERDANT_RECLAMATION_QUEST_ID,
        title: "The Verdant Reclamation",
        loreDescription: "The lumberjacks of Ironhold have pushed too far into the Whisperwood. The forest is pushing back.",
        initialStepId: questStepId("investigate_camp"),
        steps: {
            [questStepId("investigate_camp")]: {
                id: questStepId("investigate_camp"),
                logDescription: "Respond to the distress signal from the Northern Logging Camp.",
                targetNodeId: { mapNodeId: mapNodeId("logging_camp") },
                onEnterSceneId: sceneId("scene_invasion_start"),
            },
        }
    };