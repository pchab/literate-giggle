import type { Encounter } from "../../battle/data/encounters.data";
import { Quest, QuestStep } from "@/modules/campaign/domain/quests.type";

export type NodeType = "TOWN" | "BATTLE" | "CAMP" | "EVENT";

export type CampaignCondition = 
    | { type: "QUEST_COMPLETED"; questId: Quest["id"] }
    | { type: "QUEST_ACTIVE"; questId: Quest["id"]; stepId?: QuestStep["id"] | QuestStep["id"][] }
    | { type: "HAS_FLAG"; flagId: string };

export interface MapNode {
	id: string & { readonly __brand: "NodeId" };
	name: string;
	type: NodeType;
	position: { x: number; y: number }; // CSS percentages (0-100)
	connectedNodeIds: string[];
	encounterId?: Encounter["id"];
	background: string;

	unlockCondition?: CampaignCondition; 
    variants?: Array<{
        condition: CampaignCondition;
        override: Partial<MapNode>; // Allows overriding name, type, encounter, etc.
    }>;
}

export function mapNodeId(id: string): MapNode["id"] {
	return id as MapNode["id"];
}

export type MapData = Record<string, MapNode>;
