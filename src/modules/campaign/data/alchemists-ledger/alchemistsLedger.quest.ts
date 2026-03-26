import type { Quest } from "@/modules/campaign/domain/quests.type";
import { townLocationId } from "@/modules/towns/domain/towns.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import { THE_ALCHEMISTS_LEDGER as ALCHEMIST } from "./alchemistsLedger.definitions";

export const alchemistQuest: Quest = {
	id: ALCHEMIST.id,
	title: "The Alchemist's Ledger",
	loreDescription:
		"Barnaby the Alchemist hired you to recover his stolen master ledger from a band of goblins. He claims it contains vital cures, but the goblins' trail suggests something far more sinister.",
	initialStepId: ALCHEMIST.steps.track_goblins,
	steps: {
		[ALCHEMIST.steps.meet_barnaby]: {
			id: ALCHEMIST.steps.meet_barnaby,
			logDescription:
				"Track the goblins through the frost-caves to their cache.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("connury_town"),
					locationId: townLocationId("alchemist_shop"),
				},
			],
			onEnterSceneId: ALCHEMIST.scenes.intro,
		},
		[ALCHEMIST.steps.track_goblins]: {
			id: ALCHEMIST.steps.track_goblins,
			logDescription:
				"Track the goblins through the frost-caves to their cache.",
			targetNodeId: [{ mapNodeId: mapNodeId("northern_road") }],
			onWinSceneId: ALCHEMIST.scenes.cache,
		},
		[ALCHEMIST.steps.infiltrate_lab]: {
			id: ALCHEMIST.steps.infiltrate_lab,
			logDescription:
				"Infiltrate the goblin lair and recover the stolen ledger.",
			targetNodeId: [{ mapNodeId: mapNodeId("goblin_lair") }],
			onWinSceneId: ALCHEMIST.scenes.goblin_lab_victory,
		},
		[ALCHEMIST.steps.confront_barnaby]: {
			id: ALCHEMIST.steps.confront_barnaby,
			logDescription:
				"Return to Barnaby and confront him about his 'medicine'.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("connury_town"),
					locationId: townLocationId("alchemist_shop"),
				},
			],
			onEnterSceneId: ALCHEMIST.scenes.betrayal,
		},
	},
};
