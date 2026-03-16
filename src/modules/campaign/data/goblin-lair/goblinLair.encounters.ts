import type { Encounter } from "../../domain/encounters.type";
import { GOBLIN_LAIR } from "./goblinLair.definitions";
import { goblin } from '@/modules/figures/data/monsters/goblin.data';

export const GOBLIN_LAIR_ENCOUNTERS: Record<string, Encounter> = {
	[GOBLIN_LAIR.encounters.goblin_shaman]: {
		id: GOBLIN_LAIR.encounters.goblin_shaman,
		name: "Goblin Shaman",
		generateMonsters: () => [
			{
				...goblin,
				gridPosition: { col: 4, row: 4 },
			},
		],
		onWinSceneId: GOBLIN_LAIR.scenes.captured_slaves,
		onLoseSceneId: GOBLIN_LAIR.scenes.game_over_lair,
	},
};
