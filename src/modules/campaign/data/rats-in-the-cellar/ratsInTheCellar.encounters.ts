import { getCellId } from "@/modules/battle/helpers/grid.helpers";
import { rat, ratBoss } from "@/modules/figures/data/monsters/rat.data";
import { barrel } from "@/modules/figures/data/summons/barrel";
import { monsterId } from "@/modules/figures/helpers/figures.helpers";
import type { Encounter } from "../../domain/encounters.type";
import { RAT_IN_THE_CELLAR } from "./ratsInTheCellar.definitions";

export const RATS_IN_THE_CELLAR_ENCOUNTERS: Record<string, Encounter> = {
	[RAT_IN_THE_CELLAR.encounters.rat_mob]: {
		id: RAT_IN_THE_CELLAR.encounters.rat_mob,
		name: "Filthy rats",
		generateMonsters: () => [
			{
				...rat,
				gridPosition: { col: 3, row: 3 },
			},
			{
				...rat,
				gridPosition: { col: 3, row: 4 },
			},
			{
				...rat,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...rat,
				gridPosition: { col: 4, row: 4 },
			},
		],
		generateSummons: () => [
			{
				...barrel,
				allegiance: "NEUTRAL",
				gridPosition: { col: 4, row: 1 },
			},
			{
				...barrel,
				allegiance: "NEUTRAL",
				gridPosition: { col: 4, row: 2 },
			},
		],
		surfaces: {
			[getCellId({ col: 3, row: 2 })]: {
				position: { col: 3, row: 2 },
				type: "TRAP",
				duration: -1,
				damage: 3,
				spriteBase: "/surfaces/mouse_trap.webp",
				charges: 1,
			},
		},
		onWinSceneId: RAT_IN_THE_CELLAR.scenes.investigate_cellar,
	},
	[RAT_IN_THE_CELLAR.encounters.rat_boss]: {
		id: RAT_IN_THE_CELLAR.encounters.rat_boss,
		name: "Big rat !",
		generateMonsters: () => [
			{
				...ratBoss,
				gridPosition: { col: 3, row: 3 },
			},
			{
				...rat,
				id: monsterId("rat-1"),
				gridPosition: { col: 3, row: 4 },
			},
			{
				...rat,
				id: monsterId("rat-2"),
				gridPosition: { col: 4, row: 3 },
			},
		],
		generateSummons: () => [
			{
				...barrel,
				allegiance: "NEUTRAL",
				gridPosition: { col: 4, row: 1 },
			},
			{
				...barrel,
				allegiance: "NEUTRAL",
				gridPosition: { col: 4, row: 2 },
			},
		],
		onWinSceneId: RAT_IN_THE_CELLAR.scenes.report_victory,
	},
};
