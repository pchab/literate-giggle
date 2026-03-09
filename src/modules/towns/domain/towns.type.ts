import type { Scene } from "@/modules/campaign/domain/scenes.type";
import type { CampaignCondition } from "@/modules/world/domain/map.types";

export type TownLocation = {
	id: string & { readonly __brand: "TownLocationId" };
	name: string;
	type: "HEAL" | "SCENE" | "FORGE";
	defaultSceneId?: Scene["id"];
	icon?: string;
	position: { x: number; y: number };
	unlockCondition?: CampaignCondition[];
	hideCondition?: CampaignCondition[];
};

export type TownData = {
	id: string & { readonly __brand: "TownId" };
	name: string;
	backgroundImage: string;
	locations: TownLocation[];
};

export function townId(id: string): TownData["id"] {
	return `town-${id}` as TownData["id"];
}

export function townLocationId(id: string): TownLocation["id"] {
	return `town-location-${id}` as TownLocation["id"];
}
