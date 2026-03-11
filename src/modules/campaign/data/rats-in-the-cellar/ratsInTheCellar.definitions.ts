import { encounterId } from "../../domain/encounters.type";
import { questId, questStepId } from "../../domain/quests.type";
import { sceneId } from "../../domain/scenes.type";

export const RAT_IN_THE_CELLAR = {
	id: questId("rat_in_the_cellar"),
	steps: {
		tavern_meeting: questStepId("rusty_boar_cellar_rats"),
	},
	scenes: {
		job_offer: sceneId("pest_control_job_offer"),
		investigate_cellar: sceneId("investigate_cellar"),
		report_victory: sceneId("report_victory"),
	},
	encounters: {
		rat_mob: encounterId("rat_mob"),
		rat_boss: encounterId("rat_boss"),
	},
} as const;
