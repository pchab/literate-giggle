import {
	doBoundingBoxesIntersect,
	getCellId,
} from "@/modules/battle/helpers/grid.helpers";
import type { BattleState } from "@/modules/battle/store/battle.store";
import { deadlyHazard } from "@/modules/cards/data/surfaces/deadlyHazard";
import { toxicSewer } from "@/modules/cards/data/surfaces/toxicSewer";
import { cardId } from "@/modules/cards/helpers/cards.helper";
import { giantToad } from "@/modules/units/data/monsters/giant-toad";
import { ratBoss } from "@/modules/units/data/monsters/rat.data";
import {
	sumpSlime,
	sumpWatcher,
} from "@/modules/units/data/monsters/sump-slime";
import { zombie } from "@/modules/units/data/monsters/zombie";
import { smugglerCrate } from "@/modules/units/data/summons/smugglersCrate";
import { villager } from "@/modules/units/data/summons/villager";
import { well } from "@/modules/units/data/summons/well";
import { isHero } from "@/modules/units/helpers/units.helpers";
import type { Encounter } from "../../domain/encounters.type";
import { hasStoryFlag, STORY_FLAGS } from "../../helpers/storyFlags";
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
			// Consequences: Barnaby's mutagen kept flowing / the Rat King fled into the sewers.
			...(hasStoryFlag(STORY_FLAGS.mutagenSpreading)
				? [
						{ ...sumpSlime, gridPosition: { col: 6, row: 5 } },
						{ ...sumpSlime, gridPosition: { col: 6, row: 6 } },
					]
				: []),
			...(hasStoryFlag(STORY_FLAGS.ratKingEscaped)
				? [
						{
							...ratBoss,
							// No trapdoor down here: he just bites.
							hint: "Out of his cellar, the Rat King has no rats left to call. He bites like a cornered animal.",
							intentPool: [{ cardId: cardId("rat_bite"), weight: 1 }],
							gridPosition: { col: 3, row: 6 },
						},
					]
				: []),
		],
		onLoseSceneId: SEWER_CONTAMINATION.scenes.toad_lost,
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
				duration: -1,
				gridPosition: { col: 0, row: 2 },
				size: { cols: sewerBounds.cols, rows: 3 },
				onStep: toxicSewer,
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

			// The Pursuers (Spawning behind the villagers) — a Rogue can clear them first
			...(hasStoryFlag("riverbend_scouted")
				? []
				: [
						{ ...zombie, gridPosition: { col: 0, row: 3 } },
						{ ...zombie, gridPosition: { col: 0, row: 4 } },
					]),

			// Consequences of earlier choices (a Mage can burn the extra sludge)
			...(hasStoryFlag(STORY_FLAGS.mutagenSpreading) &&
			!hasStoryFlag("riverbend_sludge_burned")
				? [
						{ ...zombie, gridPosition: { col: 10, row: 2 } },
						{ ...zombie, gridPosition: { col: 10, row: 4 } },
					]
				: []),
			...(hasStoryFlag(STORY_FLAGS.toadEscaped)
				? [{ ...giantToad, gridPosition: { col: 8, row: 3 } }]
				: []),
		],
		onWinSceneId: SEWER_CONTAMINATION.scenes.riverbend_victory,
		onLoseSceneId: SEWER_CONTAMINATION.scenes.riverbend_lost,
		// Partial outcome: how many villagers made it shapes the ending.
		outcomeFlags: ({ objectiveProgress: { savedVillagers = 0 } }) =>
			savedVillagers >= 4 ? [STORY_FLAGS.riverbendAllSaved] : [],
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
				onStep: deadlyHazard,
				duration: -1,
				gridPosition: { col: 5, row: 0 },
				size: { cols: 2, rows: 3 },
			},
			[getCellId({ col: 5, row: 3 })]: {
				id: getCellId({ col: 5, row: 3 }),
				spriteBase: "/surfaces/bridge.webp",
				type: "TERRAIN",
				duration: -1,
				gridPosition: { col: 5, row: 3 },
				size: { cols: 2, rows: 2 },
			},
			[getCellId({ col: 5, row: 5 })]: {
				id: getCellId({ col: 5, row: 5 }),
				spriteBase: "/surfaces/river_2.webp",
				type: "HAZARD",
				onStep: deadlyHazard,
				duration: -1,
				gridPosition: { col: 5, row: 5 },
				size: { cols: 2, rows: 3 },
			},
			[getCellId({ col: 11, row: 3 })]: {
				id: getCellId({ col: 11, row: 3 }),
				spriteBase: "/surfaces/escape_zone.webp",
				type: "SPECIAL",
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
	[SEWER_CONTAMINATION.encounters.sump_watcher]: {
		id: SEWER_CONTAMINATION.encounters.sump_watcher,
		name: "The Sump Watcher",
		tip: "Hitting the Watcher only splits it. It dissolves on its own: survive five turns.",
		onWinSceneId: SEWER_CONTAMINATION.scenes.den_victory,
		onLoseSceneId: SEWER_CONTAMINATION.scenes.den_lost,
		gridSize: { cols: 14, rows: 7 },
		generateMonsters: () => [
			// Took the Riverbend detour first: the Black Fangs fortified the dock.
			...(hasStoryFlag("black_fangs_fortified")
				? [
						{ ...sumpSlime, gridPosition: { col: 10, row: 1 } },
						{ ...sumpSlime, gridPosition: { col: 10, row: 5 } },
					]
				: []),
			{
				...sumpWatcher,
				gridPosition: { col: 12, row: 2 },
				statuses: [{ type: "unstable_mitosis", amount: 1, duration: -1 }],
			},
		],
		generateSummons: () => [
			{
				...smugglerCrate,
				gridPosition: { col: 6, row: 2 },
				allegiance: "NEUTRAL",
			},
			{
				...smugglerCrate,
				gridPosition: { col: 6, row: 5 },
				allegiance: "NEUTRAL",
			},
		],
		removedCells: [
			{ col: 4, row: 0 },
			{ col: 4, row: 1 },
			{ col: 4, row: 2 },
			{ col: 4, row: 5 },
			{ col: 4, row: 6 },
		],
		startingPositions: [
			{ col: 7, row: 2 },
			{ col: 7, row: 3 },
			{ col: 7, row: 4 },
		],
	},
};
