import type { MapNode } from "@/modules/world/domain/map.types";
import type { Scene } from "../../quests/domain/scenes.type";

export interface QuestStep {
	id: string & { readonly __brand: "StepId" };
	logDescription: string;
	targetNodeId?: MapNode["id"];
	onEnterSceneId?: Scene["id"];
	onWinSceneId?: Scene["id"];
}

export interface Quest {
	id: string & { readonly __brand: "QuestId" };
	title: string;
	loreDescription: string;
	initialStepId: QuestStep["id"];
	steps: Record<QuestStep["id"], QuestStep>;
}

export function questId(id: string): Quest["id"] {
	return `quest-${id}` as Quest["id"];
}

export function questStepId(id: string): QuestStep["id"] {
	return `quest-step-${id}` as QuestStep["id"];
}
