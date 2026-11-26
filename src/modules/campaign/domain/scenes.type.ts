import type { Encounter } from "@/modules/campaign/domain/encounters.type";
import type { EvolutionRuneId } from "@/modules/cards/data/evolutionRecipes.data";
import type { HeroClass } from "@/modules/units/domain/heroClass.types";
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
	| { type: "CLEAR_FLAG"; flagId: string }
	/** Branch on story flags: `all` must be set, `none` must be unset. */
	| {
			type: "IF_FLAGS";
			all?: string[];
			none?: string[];
			/** Run when the condition holds. */
			actions: SceneAction[];
			/** Run otherwise. */
			otherwise?: SceneAction[];
	  }
	/** Heal every hero by `amount` HP (inn, healer, blessing…). */
	| { type: "HEAL_PARTY"; amount: number }
	| { type: "FORCE_MOVE"; nodeId: MapNode["id"] }
	| { type: "END_SCENE" };

// --- 2. SCENE PRESENTATION ---
export interface SceneChoice {
	label: string;
	actions: SceneAction[];
	reqClass?: HeroClass;
	/** Only shown when all these story flags are set. */
	reqFlags?: string[];
	/** Hidden when any of these story flags is set. */
	hideIfFlags?: string[];
}

export interface SceneStep {
	speaker?: string;
	text: string;
	backgroundImage?: string;
	choices?: SceneChoice[];
	onNext?: SceneAction[];
	/** Runs once when the step is shown (e.g. IF_FLAGS → CHANGE_STEP to branch automatically). */
	onEnter?: SceneAction[];
}

export interface Scene {
	id: string & { readonly __brand: "SceneId" };
	initialStepId: string;
	steps: Record<string, SceneStep>;
}

export function sceneId(id: string): Scene["id"] {
	return `scene-${id}` as Scene["id"];
}
