import type { Quest, QuestStep } from "@/modules/campaign/domain/quests.type";
import type { TownData } from "@/modules/towns/domain/towns.type";
import type { Encounter } from "../../campaign/data/encounters.data";

export type NodeType = "TOWN" | "BATTLE" | "CAMP" | "EVENT";

export type CampaignCondition =
	| { type: "QUEST_COMPLETED"; questId: Quest["id"] }
	| {
			type: "QUEST_ACTIVE";
			questId: Quest["id"];
			stepId?: QuestStep["id"][];
	  }
	| { type: "HAS_FLAG"; flagId: string };

export interface MapNode {
	id: string & { readonly __brand: "NodeId" };
	name: string;
	type: NodeType;
	position: { x: number; y: number }; // CSS percentages (0-100)
	connectedNodeIds: string[];
	encounterId?: Encounter["id"];
	background?: string;
	townId?: TownData["id"];
	unlockCondition?: CampaignCondition[];
	variants?: Array<{
		condition: CampaignCondition;
		override: Partial<MapNode>; // Allows overriding name, type, encounter, etc.
	}>;
}

export function mapNodeId(id: string): MapNode["id"] {
	return id as MapNode["id"];
}

export type MapData = Record<string, MapNode>;
