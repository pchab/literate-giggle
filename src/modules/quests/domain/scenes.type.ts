import type { HeroClass } from "@/modules/heroClass/domain/heroClass.types";
import type { Encounter } from "@/modules/map/domain/encounters.data";
import type { Quest, QuestStep } from "./quests.type";
import { MapNode } from "@/modules/map/domain/map.model";

// --- 1. THE ACTION ENGINE ---
// Every possible outcome of clicking a scene choice
export type SceneAction =
	| { type: "START_BATTLE"; encounterId: Encounter["id"]; background: string }
	| { type: "START_SCENE"; sceneId: Scene["id"] }
	| { type: "CHANGE_STEP"; stepId: string }
	| { type: "ADVANCE_QUEST"; questId: Quest["id"]; newStepId: QuestStep["id"] }
	| { type: "COMPLETE_QUEST"; questId: Quest["id"] }
	| { type: "UPGRADE_CLASS_CARDS"; heroClass: HeroClass }
	| { type: "GRANT_XP"; amount: number }
	| { type: "END_SCENE" };

// --- 2. SCENE PRESENTATION ---
export interface SceneChoice {
	label: string;
	actions: SceneAction[];
	reqClass?: HeroClass;
}

export interface SceneStep {
	speaker?: string;
	text: string;
	backgroundImage?: string;
	choices?: SceneChoice[];
	onNext?: SceneAction[];
}

export interface Scene {
	id: string & { readonly __brand: "SceneId" };
	initialStepId: string;
	steps: Record<string, SceneStep>;
}

export function sceneId(id: string): Scene["id"] {
	return `scene-${id}` as Scene["id"];
}
