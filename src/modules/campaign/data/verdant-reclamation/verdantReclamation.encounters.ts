import { beastMaster } from "@/modules/figures/data/monsters/beast-master";
import { elvenCommander } from "@/modules/figures/data/monsters/elven-commander.data";
import { elvenWeaver } from "@/modules/figures/data/monsters/elven-weaver";
import { treant_bruiser } from "@/modules/figures/data/monsters/treant.data";
import { type Encounter, encounterId } from "../../domain/encounters.type";
import { sceneId } from "../../domain/scenes.type";

export const VERDANT_RECLAMATION_ENCOUNTER_DB: Record<string, Encounter> = {
	// --- FIRST ENCOUNTER: KIVEN BRIDGE ---
	[encounterId("elven_commander")]: {
		id: encounterId("elven_commander"),
		name: "Kiven River Bridge - Elven Commander",
		generateMonsters: () => [
			{
				...elvenCommander,
				gridPosition: { col: 3, row: 3 },
			},
			{
				...elvenWeaver,
				gridPosition: { col: 4, row: 2 },
			},
			{
				...elvenWeaver,
				gridPosition: { col: 2, row: 4 },
			},
		],
	},

	// --- FRONT 1: THE NORTH (Push Mechanics) ---
	[encounterId("treant_bruisers")]: {
		id: encounterId("treant_bruisers"),
		name: "Northern Plain - Elven Treant Bruisers",
		generateMonsters: () => [
			{
				...treant_bruiser,
				gridPosition: { col: 3, row: 3 },
			},
			{
				...treant_bruiser,
				gridPosition: { col: 4, row: 4 },
			},
		],
		onWinSceneId: sceneId("victory_north_front"),
	},

	// --- FRONT 2: THE WEST (Agile / Standard Damage) ---
	[encounterId("elven_weavers")]: {
		id: encounterId("elven_weavers"),
		name: "Kiven River - Elven Weavers",
		generateMonsters: () => [
			{
				...elvenWeaver,
				gridPosition: { col: 3, row: 3 },
			},
		],
		onWinSceneId: sceneId("victory_west_front"),
	},

	// --- FRONT 3: THE SOUTH (Summon Mechanics) ---
	[encounterId("beastmasters")]: {
		id: encounterId("beastmasters"),
		name: "Southern Plain - Elven Beastmasters",
		generateMonsters: () => [
			{
				...beastMaster,
				gridPosition: { col: 3, row: 3 },
			},
			{
				...beastMaster,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...beastMaster,
				gridPosition: { col: 3, row: 4 },
			},
		],
		onWinSceneId: sceneId("victory_south_front"),
	},

	// --- TAVERN AMBUSH (Reinforcement Mechanics) ---
	[encounterId("defend_tavern_ambush")]: {
		id: encounterId("defend_tavern_ambush"),
		name: "Tavern Ambush - Elven Assassins",
		generateMonsters: () => [
			{
				...elvenWeaver,
				gridPosition: { col: 2, row: 2 },
			},
			{
				...elvenWeaver,
				gridPosition: { col: 4, row: 2 },
			},
		],
		onWinSceneId: sceneId("victory_defend_tavern_ambush"),
	},

	[encounterId("assault_tavern_ambush")]: {
		id: encounterId("assault_tavern_ambush"),
		name: "Tavern Ambush - Frightened Citizens",
		generateMonsters: () => [
			{
				...elvenWeaver,
				gridPosition: { col: 2, row: 2 },
			},
			{
				...elvenWeaver,
				gridPosition: { col: 4, row: 2 },
			},
		],
		onWinSceneId: sceneId("victory_assault_tavern_ambush"),
	},

	// --- SIEGE GATES ---
	[encounterId("defend_siege_gates")]: {
		id: encounterId("defend_siege_gates"),
		name: "Siege Gates - Elven Warriors",
		generateMonsters: () => [
			{
				...elvenWeaver,
				gridPosition: { col: 2, row: 2 },
			},
			{
				...elvenWeaver,
				gridPosition: { col: 4, row: 2 },
			},
		],
		onWinSceneId: sceneId("victory_defend_siege_gates"),
	},

	[encounterId("assault_siege_gates")]: {
		id: encounterId("assault_siege_gates"),
		name: "Siege Gates - Iron Soldiers",
		generateMonsters: () => [
			{
				...elvenWeaver,
				gridPosition: { col: 2, row: 2 },
			},
			{
				...elvenWeaver,
				gridPosition: { col: 4, row: 2 },
			},
		],
		onWinSceneId: sceneId("victory_assault_siege_gates"),
	},

	// --- FINAL BATTLES ---
	[encounterId("ironhold_arch_druid_boss")]: {
		id: encounterId("ironhold_arch_druid_boss"),
		name: "Final Battle - Defend Ironhold",
		generateMonsters: () => [
			{
				...elvenWeaver,
				gridPosition: { col: 3, row: 3 },
			},
		],
		onWinSceneId: sceneId("ironhold_siege_victory"),
	},
	[encounterId("ironhold_king_boss")]: {
		id: encounterId("ironhold_king_boss"),
		name: "Final Battle - Defend Ironhold",
		generateMonsters: () => [
			{
				...elvenWeaver,
				gridPosition: { col: 3, row: 3 },
			},
		],
		onWinSceneId: sceneId("ironhold_assault_victory"),
	},
};
