import { sceneId } from "@/modules/campaign/domain/scenes.type";
import type { TownData } from "../domain/towns.type";
import { townId, townLocationId } from "../domain/towns.type";

export const TOWN_DB: Record<TownData["id"], TownData> = {
	[townId("ironhold")]: {
		id: townId("ironhold"),
		name: "Ironhold City",
		backgroundImage: "/towns/ironhold.jpg",
		locations: [
			{
				id: townLocationId("ironhold_tavern"),
				name: "The Rusty Boar Tavern",
				type: "SCENE",
				defaultSceneId: sceneId("generic_tavern"),
				position: { x: 44, y: 36 },
			},
			{
				id: townLocationId("ironhold_inn"),
				name: "City Inn (Rest)",
				type: "HEAL",
				position: { x: 48, y: 50 },
			},
		],
	},
};
