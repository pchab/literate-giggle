import { briarWolf } from "@/modules/units/data/monsters/briar-wolf";
import type { Encounter } from "../../domain/encounters.type";
import { SHADOWS_DEBT } from "./shadowsDebt.definitions";

export const SHADOWS_DEBT_ENCOUNTERS: Record<string, Encounter> = {
	[SHADOWS_DEBT.encounters.briar_wolf_boss]: {
		id: SHADOWS_DEBT.encounters.briar_wolf_boss,
		name: "Cursed Briar Wolf",
		generateMonsters: () => [
			{
				...briarWolf,
				maxHp: 60,
				gridPosition: { col: 4, row: 3 },
			},
			{
				...briarWolf,
				maxHp: 20,
				gridPosition: { col: 4, row: 2 },
			},
			{
				...briarWolf,
				maxHp: 20,
				gridPosition: { col: 4, row: 4 },
			},
		],
		onWinSceneId: SHADOWS_DEBT.scenes.wolf_victory,
		onLoseSceneId: SHADOWS_DEBT.scenes.game_over_forest,
	},
};
