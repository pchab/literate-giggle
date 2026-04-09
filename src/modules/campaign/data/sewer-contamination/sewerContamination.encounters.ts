import {
	doBoundingBoxesIntersect,
	getCellId,
} from "@/modules/battle/helpers/grid.helpers";
import type { BattleState } from "@/modules/battle/store/battle.store";
import { giantToad } from "@/modules/units/data/monsters/giant-toad";
import { zombie } from "@/modules/units/data/monsters/zombie";
import { smugglerCrate } from "@/modules/units/data/summons/smugglersCrate";
import { villager } from "@/modules/units/data/summons/villager";
import { well } from "@/modules/units/data/summons/well";
import { isHero } from "@/modules/units/helpers/units.helpers";
import type { Encounter } from "../../domain/encounters.type";
import { SEWER_CONTAMINATION } from "./sewerContamination.definitions";

const sewerBounds = { cols: 7, rows: 7 };
const villageBounds = { cols: 12, rows: 8 };
const REQUIRED_SURVIVORS = 2;

export const sewerContaminationEncounters: Record<string, Encounter> = {
	[SEWER_CONTAMINATION.encounters.giant_toad]: {
		id: SEWER_CONTAMINATION.encounters.giant_toad,
		name: "Giant Toad",
		generateMonsters: () => [
			{
				...giantToad,
				gridPosition: { col: 4, row: 5 },
			},
		],
		generateSummons: () => [
			{
				...smugglerCrate,
				gridPosition: { col: 4, row: 0 },
				allegiance: "NEUTRAL",
			},
			{
				...smugglerCrate,
				gridPosition: { col: 5, row: 0 },
				allegiance: "NEUTRAL",
			},
			{
				...smugglerCrate,
				gridPosition: { col: 0, row: 6 },
				allegiance: "NEUTRAL",
			},
			{
				...smugglerCrate,
				gridPosition: { col: 1, row: 6 },
				allegiance: "NEUTRAL",
			},
		],
		surfaces: {
			[getCellId({ col: 0, row: 2 })]: {
				id: getCellId({ col: 0, row: 2 }),
				spriteBase: "/surfaces/sewers_stream.webp",
				type: "HAZARD",
				damage: 1,
				duration: -1,
				gridPosition: { col: 0, row: 2 },
				size: { cols: sewerBounds.cols, rows: 3 },
			},
		},
		onWinSceneId: SEWER_CONTAMINATION.scenes.victory,
		gridSize: sewerBounds,
	},
	[SEWER_CONTAMINATION.encounters.riverbend_village]: {
		id: SEWER_CONTAMINATION.encounters.riverbend_village,
		name: "Riverbend Village",
		flavorText:
			"Barnaby’s mutagen has tainted the river. Escort the survivors to the Ironhold barricade before the sludge claims them!",
		generateMonsters: () => [
			{ ...zombie, gridPosition: { col: 9, row: 0 } },
			{ ...zombie, gridPosition: { col: 10, row: 1 } },
			{ ...zombie, gridPosition: { col: 10, row: 5 } },
			{ ...zombie, gridPosition: { col: 9, row: 6 } },

			// The Pursuers (Spawning behind the villagers)
			{ ...zombie, gridPosition: { col: 0, row: 3 } },
			{ ...zombie, gridPosition: { col: 0, row: 4 } },
		],
		generateSummons: () => [
			{
				...villager,
				gridPosition: { col: 2, row: 5 },
				allegiance: "PLAYER",
			},
			{
				...villager,
				gridPosition: { col: 2, row: 6 },
				allegiance: "PLAYER",
			},
			{
				...villager,
				gridPosition: { col: 3, row: 6 },
				allegiance: "PLAYER",
			},
			{
				...villager,
				gridPosition: { col: 1, row: 6 },
				allegiance: "PLAYER",
			},
			{
				...well,
				gridPosition: { col: 8, row: 2 },
				allegiance: "NEUTRAL",
			},
		],
		surfaces: {
			[getCellId({ col: 5, row: 0 })]: {
				id: getCellId({ col: 5, row: 0 }),
				spriteBase: "/surfaces/river_1.webp",
				type: "HAZARD",
				damage: 999,
				duration: -1,
				gridPosition: { col: 5, row: 0 },
				size: { cols: 2, rows: 3 },
			},
			[getCellId({ col: 5, row: 3 })]: {
				id: getCellId({ col: 5, row: 3 }),
				spriteBase: "/surfaces/bridge.webp",
				type: "TERRAIN",
				damage: 0,
				duration: -1,
				gridPosition: { col: 5, row: 3 },
				size: { cols: 2, rows: 2 },
			},
			[getCellId({ col: 5, row: 5 })]: {
				id: getCellId({ col: 5, row: 5 }),
				spriteBase: "/surfaces/river_2.webp",
				type: "HAZARD",
				damage: 999,
				duration: -1,
				gridPosition: { col: 5, row: 5 },
				size: { cols: 2, rows: 3 },
			},
			[getCellId({ col: 11, row: 3 })]: {
				id: getCellId({ col: 11, row: 3 }),
				spriteBase: "/surfaces/escape_zone.webp",
				type: "SPECIAL",
				damage: 0,
				duration: -1,
				gridPosition: { col: 11, row: 3 },
				size: { cols: 1, rows: 6 },
			},
		},
		objectiveText: ({ savedVillagers = 0 }) =>
			`Villagers saved: ${savedVillagers}/${REQUIRED_SURVIVORS}`,

		updateObjectives: async ({
			surfaces,
			units,
			objectiveProgress: { savedVillagers = 0 },
			currentVfx,
		}) => {
			let newlySaved = 0;
			const newVfx = { ...currentVfx };
			const escapeZone = surfaces[getCellId({ col: 11, row: 3 })];
			if (!escapeZone) return;

			const remainingUnits = units.filter((u) => {
				if (u.name !== villager.name) {
					return true;
				}
				if (doBoundingBoxesIntersect(u, escapeZone)) {
					newlySaved++;
					newVfx[getCellId(u.gridPosition)] = { type: "ESCAPE" };
					return false;
				}
				return true;
			});

			if (newlySaved > 0) {
				return {
					units: remainingUnits,
					currentVfx: newVfx,
					objectiveProgress: {
						savedVillagers: savedVillagers + newlySaved,
					},
				};
			}
		},

		checkWin: ({ objectiveProgress: { savedVillagers = 0 } }: BattleState) => {
			return savedVillagers >= REQUIRED_SURVIVORS;
		},

		checkLoss: ({
			units,
			objectiveProgress: { savedVillagers = 0 },
		}: BattleState) => {
			// 1. Did the heroes wipe?
			const heroesAlive = units.some((u) => isHero(u));
			if (!heroesAlive) return true;

			// 2. Did too many villagers fall in the river or get eaten?
			const livingVillagers = units.filter(
				(u) => u.name === villager.name && u.currentHp > 0,
			).length;

			if (livingVillagers + savedVillagers < REQUIRED_SURVIVORS) return true;

			return false;
		},
		gridSize: villageBounds,
	},
};
