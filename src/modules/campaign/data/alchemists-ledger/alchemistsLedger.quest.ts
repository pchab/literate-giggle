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
		[ALCHEMIST.steps.track_goblins]: {
			id: ALCHEMIST.steps.track_goblins,
			logDescription:
				"Track the goblins through the frost-caves to their cache.",
			targetNodeId: [{ mapNodeId: mapNodeId("node_frost_woods") }],
			onEnterSceneId: ALCHEMIST.scenes.cache,
		},
		[ALCHEMIST.steps.infiltrate_lab]: {
			id: ALCHEMIST.steps.infiltrate_lab,
			logDescription:
				"Infiltrate the goblin laboratory and recover the stolen ledger.",
			targetNodeId: [{ mapNodeId: mapNodeId("node_goblin_caves") }],
		},
		[ALCHEMIST.steps.confront_barnaby]: {
			id: ALCHEMIST.steps.confront_barnaby,
			logDescription:
				"Return to Barnaby and confront him about his 'medicine'.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("node_starting_town"),
					locationId: townLocationId("loc_alchemist_shop"),
				},
			],
			onEnterSceneId: ALCHEMIST.scenes.betrayal,
		},
	},
};
