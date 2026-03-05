import { beastMaster } from "@/modules/figures/data/monsters/beast-master";
import { elvenWeaver } from "@/modules/figures/data/monsters/elven-weaver";
import { treant } from "@/modules/figures/data/monsters/treant.data";
import type { Monster } from "@/modules/figures/domain/figures.type";
import { monsterId } from "@/modules/figures/helpers/figures.helpers";
import { sceneId } from "../../domain/scenes.type";
import { type Encounter, encounterId } from "../encounters.data";

export const VERDANT_RECLAMATION_ENCOUNTER_DB: Record<string, Encounter> = {
	// --- FIRST ENCOUNTER: KIVEN BRIDGE ---
	[encounterId("elven_commander")]: {
		id: encounterId("elven_commander"),
		name: "Kiven River Bridge - Elven Commander",
		generateMonsters: (): Monster[] => [
			{
				id: monsterId("elven_commander"),
				...elvenWeaver,
				currentHp: elvenWeaver.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
		],
	},

	// --- FRONT 1: THE NORTH (Push Mechanics) ---
	[encounterId("treant_bruisers")]: {
		id: encounterId("treant_bruisers"),
		name: "Northern Plain - Elven Treant Bruisers",
		generateMonsters: (): Monster[] => [
			{
				id: monsterId("treant_1"),
				...treant,
				currentHp: treant.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
			{
				id: monsterId("treant_2"),
				...treant,
				currentHp: treant.maxHp,
				gridPosition: { col: 4, row: 4 },
			},
		],
		onWinSceneId: sceneId("victory_north_front"),
	},

	// --- FRONT 2: THE WEST (Agile / Standard Damage) ---
	[encounterId("elven_weavers")]: {
		id: encounterId("elven_weavers"),
		name: "Kiven River - Elven Weavers",
		generateMonsters: (): Monster[] => [
			{
				id: monsterId("weaver_1"),
				...elvenWeaver,
				currentHp: elvenWeaver.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
		],
		onWinSceneId: sceneId("victory_west_front"),
	},

	// --- FRONT 3: THE SOUTH (Summon Mechanics) ---
	[encounterId("beastmasters")]: {
		id: encounterId("beastmasters"),
		name: "Southern Plain - Elven Beastmasters",
		generateMonsters: (): Monster[] => [
			{
				id: monsterId("beastmaster_1"),
				...beastMaster,
				currentHp: beastMaster.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
		],
		onWinSceneId: sceneId("victory_south_front"),
	},

	// --- TAVERN AMBUSH (Reinforcement Mechanics) ---
	[encounterId("defend_tavern_ambush")]: {
		id: encounterId("defend_tavern_ambush"),
		name: "Tavern Ambush - Elven Assassins",
		generateMonsters: (): Monster[] => [
			{
				id: monsterId("assassin_1"),
				...elvenWeaver,
				currentHp: elvenWeaver.maxHp,
				gridPosition: { col: 2, row: 2 },
			},
			{
				id: monsterId("assassin_2"),
				...elvenWeaver,
				currentHp: elvenWeaver.maxHp,
				gridPosition: { col: 4, row: 2 },
			},
		],
		onWinSceneId: sceneId("victory_defend_tavern_ambush"),
	},

	[encounterId("assault_tavern_ambush")]: {
		id: encounterId("assault_tavern_ambush"),
		name: "Tavern Ambush - Frightened Citizens",
		generateMonsters: (): Monster[] => [
			{
				id: monsterId("assassin_1"),
				...elvenWeaver,
				currentHp: elvenWeaver.maxHp,
				gridPosition: { col: 2, row: 2 },
			},
			{
				id: monsterId("assassin_2"),
				...elvenWeaver,
				currentHp: elvenWeaver.maxHp,
				gridPosition: { col: 4, row: 2 },
			},
		],
		onWinSceneId: sceneId("victory_assault_tavern_ambush"),
	},

	// --- SIEGE GATES ---
	[encounterId("defend_siege_gates")]: {
		id: encounterId("defend_siege_gates"),
		name: "Siege Gates - Elven Warriors",
		generateMonsters: (): Monster[] => [
			{
				id: monsterId("assassin_1"),
				...elvenWeaver,
				currentHp: elvenWeaver.maxHp,
				gridPosition: { col: 2, row: 2 },
			},
			{
				id: monsterId("assassin_2"),
				...elvenWeaver,
				currentHp: elvenWeaver.maxHp,
				gridPosition: { col: 4, row: 2 },
			},
		],
		onWinSceneId: sceneId("victory_defend_siege_gates"),
	},

	[encounterId("assault_siege_gates")]: {
		id: encounterId("assault_siege_gates"),
		name: "Siege Gates - Iron Soldiers",
		generateMonsters: (): Monster[] => [
			{
				id: monsterId("assassin_1"),
				...elvenWeaver,
				currentHp: elvenWeaver.maxHp,
				gridPosition: { col: 2, row: 2 },
			},
			{
				id: monsterId("assassin_2"),
				...elvenWeaver,
				currentHp: elvenWeaver.maxHp,
				gridPosition: { col: 4, row: 2 },
			},
		],
		onWinSceneId: sceneId("victory_assault_siege_gates"),
	},

	// --- FINAL BATTLES ---
	[encounterId("ironhold_arch_druid_boss")]: {
		id: encounterId("ironhold_arch_druid_boss"),
		name: "Final Battle - Defend Ironhold",
		generateMonsters: (): Monster[] => [
			{
				id: monsterId("arch_druid_sylas"),
				...elvenWeaver,
				currentHp: elvenWeaver.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
		],
		onWinSceneId: sceneId("ironhold_siege_victory"),
	},
	[encounterId("ironhold_king_boss")]: {
		id: encounterId("ironhold_king_boss"),
		name: "Final Battle - Defend Ironhold",
		generateMonsters: (): Monster[] => [
			{
				id: monsterId("king_tanotalos_II"),
				...elvenWeaver,
				currentHp: elvenWeaver.maxHp,
				gridPosition: { col: 3, row: 3 },
			},
		],
		onWinSceneId: sceneId("ironhold_assault_victory"),
	},
};
