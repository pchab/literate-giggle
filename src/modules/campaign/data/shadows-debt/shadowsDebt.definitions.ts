import { encounterId } from "../../domain/encounters.type";
import { questId, questStepId } from "../../domain/quests.type";
import { sceneId } from "../../domain/scenes.type";

export const SHADOWS_DEBT = {
	id: questId("shadows_debt"),
	steps: {
		speak_to_vane: questStepId("speak_to_vane"),
		hunt_the_wolf: questStepId("hunt_the_wolf"),
		report_to_vane: questStepId("report_to_vane"),
	},
	scenes: {
		vane_intro: sceneId("vane_intro"),
		wolf_ambush: sceneId("wolf_ambush"),
		wolf_victory: sceneId("wolf_victory"),
		report_to_vane: sceneId("report_to_vane"),
		game_over_forest: sceneId("game_over_forest"),
	},
	encounters: {
		briar_wolf_boss: encounterId("briar_wolf_boss"),
	},
} as const;
