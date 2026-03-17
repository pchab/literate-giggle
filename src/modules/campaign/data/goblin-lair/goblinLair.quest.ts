import { townLocationId } from "@/modules/towns/domain/towns.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import type { Quest } from "../../domain/quests.type";
import { GOBLIN_LAIR } from "./goblinLair.definitions";

export const GOBLIN_LAIR_QUEST: Quest = {
	id: GOBLIN_LAIR.id,
	title: "The Shadow's Debt",
	loreDescription:
		"Captain Vane needs a brave soul to recover a stolen relic from the gut of a Briar Wolf in the deep forest.",
	initialStepId: GOBLIN_LAIR.steps.bring_back_ledger,
	steps: {
		[GOBLIN_LAIR.steps.bring_back_ledger]: {
			id: GOBLIN_LAIR.steps.bring_back_ledger,
			logDescription: "Talk to Captain Vane at the Oakhaven Docks.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("port_city"),
					locationId: townLocationId("port_city_ship"),
				},
			],
			onEnterSceneId: GOBLIN_LAIR.scenes.find_goblin_lair,
		},
		[GOBLIN_LAIR.steps.bring_back_goods]: {
			id: GOBLIN_LAIR.steps.bring_back_goods,
			logDescription: "Track the Briar Wolf in the Whispering Woods.",
			targetNodeId: [{ mapNodeId: mapNodeId("whispering_woods") }],
			onEnterSceneId: GOBLIN_LAIR.scenes.confront_merchant,
		},
		[GOBLIN_LAIR.steps.free_the_slaves]: {
			id: GOBLIN_LAIR.steps.free_the_slaves,
			logDescription: "Bring the relic back to Captain Vane.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("port_city"),
					locationId: townLocationId("port_city_ship"),
				},
			],
			onEnterSceneId: GOBLIN_LAIR.scenes.confront_merchant,
		},
	},
};
