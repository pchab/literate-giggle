import { townLocationId } from "@/modules/towns/domain/towns.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import type { Quest } from "../../domain/quests.type";
import { RAT_IN_THE_CELLAR } from "./ratsInTheCellar.definitions";

export const RAT_IN_THE_CELLAR_QUEST: Quest = {
	id: RAT_IN_THE_CELLAR.id,
	title: "Rat Insfestation",
	loreDescription:
		"The owner of the Rusty Boar in Ironhold has rats in his cellar and could use your help.",
	initialStepId: RAT_IN_THE_CELLAR.steps.tavern_meeting,
	steps: {
		[RAT_IN_THE_CELLAR.steps.tavern_meeting]: {
			id: RAT_IN_THE_CELLAR.steps.tavern_meeting,
			logDescription: "Speak with the bartender in the Rusty Boar.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("ironhold_city"),
					locationId: townLocationId("ironhold_tavern"),
				},
			],
			onEnterSceneId: RAT_IN_THE_CELLAR.scenes.job_offer,
		},
	},
};
