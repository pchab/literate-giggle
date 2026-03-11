import { cardId } from "@/modules/cards/helpers/cards.helper";
import { rat } from "@/modules/figures/data/monsters/rat.data";
import { UnitStance } from "@/modules/figures/domain/figures.type";
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
				id: monsterId("rat-1"),
				currentHp: rat.maxHp,
				stance: UnitStance.IDLE,
				statuses: [],
				gridPosition: { col: 3, row: 3 },
			},
			{
				...rat,
				id: monsterId("rat-2"),
				currentHp: rat.maxHp,
				stance: UnitStance.IDLE,
				statuses: [],
				gridPosition: { col: 3, row: 4 },
			},
			{
				...rat,
				id: monsterId("rat-3"),
				currentHp: rat.maxHp,
				stance: UnitStance.IDLE,
				statuses: [],
				gridPosition: { col: 4, row: 3 },
			},
			{
				...rat,
				id: monsterId("rat-4"),
				currentHp: rat.maxHp,
				stance: UnitStance.IDLE,
				statuses: [],
				gridPosition: { col: 4, row: 4 },
			},
		],
		onWinSceneId: RAT_IN_THE_CELLAR.scenes.investigate_cellar,
	},
	[RAT_IN_THE_CELLAR.encounters.rat_boss]: {
		id: RAT_IN_THE_CELLAR.encounters.rat_boss,
		name: "Big rat !",
		generateMonsters: () => [
			{
				...rat,
				id: monsterId("rat-boss"),
				spriteBase: "monsters/rat_boss",
				currentHp: rat.maxHp * 3,
				maxHp: rat.maxHp * 3,
				xpReward: rat.xpReward * 3,
				stance: UnitStance.IDLE,
				statuses: [],
				gridPosition: { col: 3, row: 3 },
				intentPool: [
					{
						cardId: cardId("nasty-bite"),
						weight: 2,
					},
					{
						cardId: cardId("call_more_rats"),
						weight: 1,
					},
				],
			},
			{
				...rat,
				id: monsterId("rat-1"),
				currentHp: rat.maxHp,
				stance: UnitStance.IDLE,
				statuses: [],
				gridPosition: { col: 3, row: 4 },
			},
			{
				...rat,
				id: monsterId("rat-2"),
				currentHp: rat.maxHp,
				stance: UnitStance.IDLE,
				statuses: [],
				gridPosition: { col: 4, row: 3 },
			},
		],
		onWinSceneId: RAT_IN_THE_CELLAR.scenes.report_victory,
	},
};
