import type { Encounter } from "@/modules/campaign/data/encounters.data";
import type { EvolutionRuneId } from "@/modules/cards/data/evolutionRecipes.data";
import type { HeroClass } from "@/modules/figures/domain/heroClass.types";
import type { MapNode } from "@/modules/world/domain/map.types";
import type { Quest, QuestStep } from "./quests.type";

// --- 1. THE ACTION ENGINE ---
// Every possible outcome of clicking a scene choice
export type SceneAction =
	| { type: "START_BATTLE"; encounterId: Encounter["id"]; background: string }
	| { type: "START_SCENE"; sceneId: Scene["id"] }
	| { type: "CHANGE_STEP"; stepId: string }
	| { type: "ADVANCE_QUEST"; questId: Quest["id"]; newStepId: QuestStep["id"] }
	| {
			type: "ADVANCE_IF_FLAGS";
			requiredFlags: string[];
			questId: Quest["id"];
			newStepId: QuestStep["id"];
	  }
	| { type: "COMPLETE_QUEST"; questId: Quest["id"] }
	| {
			type: "REWARD_EVO_RUNE";
			evoRune: EvolutionRuneId;
	  }
	| { type: "SET_FLAG"; flagId: string }
	| { type: "FORCE_MOVE"; nodeId: MapNode["id"] }
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
