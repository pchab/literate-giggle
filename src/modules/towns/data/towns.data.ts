import { sceneId } from "@/modules/campaign/domain/scenes.type";
import type { TownData } from "../domain/towns.type";
import { townId, townLocationId } from "../domain/towns.type";

export const TOWN_DB: Record<TownData["id"], TownData> = {
	// --- THE BASTION ---
	[townId("ironhold_city")]: {
		id: townId("ironhold_city"),
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
			{
				id: townLocationId("ironhold_forge"),
				name: "Rune Forge",
				type: "FORGE",
				position: { x: 36, y: 72 },
			},
			{
				id: townLocationId("ironhold_throne"),
				name: "King's Throne Room",
				type: "SCENE",
				defaultSceneId: sceneId("access_denied_throne_room"),
				position: { x: 65, y: 30 },
			},
		],
	},

	[townId("ironhold_elven")]: {
		id: townId("ironhold_elven"),
		name: "Verdantreach (Former Ironhold)",
		backgroundImage: "/towns/ironhold_elven.jpg",
		locations: [
			{
				id: townLocationId("ironhold_inn"),
				name: "City Inn (Rest)",
				type: "HEAL",
				position: { x: 48, y: 50 },
			},
			{
				id: townLocationId("ironhold_forge"),
				name: "Rune Forge",
				type: "FORGE",
				position: { x: 36, y: 72 },
			},
		],
	},

	// --- THE BASTION DEFENSE AGAINST THE ELVEN INVASION ---
	[townId("ironhold_defense")]: {
		id: townId("ironhold_defense"),
		name: "Ironhold (Under Siege)",
		backgroundImage: "/towns/ironhold_siege.jpg",
		locations: [
			{
				id: townLocationId("siege_gates"),
				name: "Shattered Main Gates",
				type: "SCENE",
				defaultSceneId: sceneId("defend_siege_gates"),
				position: { x: 55, y: 60 },
				hideCondition: [{ type: "HAS_FLAG", flagId: "gates_cleared" }],
			},
			{
				id: townLocationId("siege_tavern"),
				name: "The Rusty Boar (Barricaded)",
				type: "SCENE",
				defaultSceneId: sceneId("defend_tavern_ambush"),
				position: { x: 44, y: 36 },
				hideCondition: [{ type: "HAS_FLAG", flagId: "tavern_cleared" }],
			},
			{
				id: townLocationId("siege_keep"),
				name: "The Royal Keep",
				type: "SCENE",
				defaultSceneId: sceneId("ironhold_defend_intro"),
				position: { x: 65, y: 30 },
				unlockCondition: [
					{ type: "HAS_FLAG", flagId: "gates_cleared" },
					{ type: "HAS_FLAG", flagId: "tavern_cleared" },
				],
			},
		],
	},

	// --- THE BASTION ASSAULT ON THE HUMANS ---
	[townId("ironhold_assault")]: {
		id: townId("ironhold_assault"),
		name: "Ironhold (Under Siege)",
		backgroundImage: "/towns/ironhold_siege.jpg",
		locations: [
			{
				id: townLocationId("siege_gates"),
				name: "Shattered Main Gates",
				type: "SCENE",
				defaultSceneId: sceneId("assault_siege_gates"),
				position: { x: 55, y: 60 },
				hideCondition: [{ type: "HAS_FLAG", flagId: "gates_cleared" }],
			},
			{
				id: townLocationId("siege_tavern"),
				name: "The Rusty Boar (Barricaded)",
				type: "SCENE",
				defaultSceneId: sceneId("assault_tavern_ambush"),
				position: { x: 44, y: 36 },
				hideCondition: [{ type: "HAS_FLAG", flagId: "tavern_cleared" }],
			},
			{
				id: townLocationId("siege_keep"),
				name: "The Royal Keep",
				type: "SCENE",
				defaultSceneId: sceneId("ironhold_assault_intro"),
				position: { x: 65, y: 30 },
				unlockCondition: [
					{ type: "HAS_FLAG", flagId: "gates_cleared" },
					{ type: "HAS_FLAG", flagId: "tavern_cleared" },
				],
			},
		],
	},

	// --- THE SECRET ELVEN BASE ---
	[townId("heart_tree_sanctuary")]: {
		id: townId("heart_tree_sanctuary"),
		name: "The Heart-Tree Sanctuary",
		backgroundImage: "/towns/heart_tree_sanctuary.jpg",
		locations: [
			{
				id: townLocationId("heart_tree_council"),
				name: "Arch-Druid's Roots",
				type: "SCENE",
				defaultSceneId: sceneId("heart_tree_council"),
				position: { x: 48, y: 54 },
			},
			{
				id: townLocationId("heart_tree_moonwell"),
				name: "Luminous Sap-Spring (Rest)",
				type: "HEAL",
				position: { x: 70, y: 56 },
			},
		],
	},

	[townId("cromee_town")]: {
		id: townId("cromee_town"),
		name: "Cromee Town",
		backgroundImage: "/towns/cromee_town.jpg",
		locations: [
			{
				id: townLocationId("cromee_tavern"),
				name: "The Rusty Nail Tavern",
				type: "SCENE",
				defaultSceneId: sceneId("generic_tavern"),
				position: { x: 22, y: 60 },
			},
			{
				id: townLocationId("cromee_inn"),
				name: "City Inn (Rest)",
				type: "HEAL",
				position: { x: 40, y: 42 },
			},
		],
	},
};
