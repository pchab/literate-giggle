import { townLocationId } from "@/modules/towns/domain/towns.type";
import { mapNodeId } from "@/modules/world/domain/map.types";
import type { Quest } from "../../domain/quests.type";
import { GOBLIN_LAIR } from "./goblinLair.definitions";

export const GOBLIN_LAIR_QUEST: Quest = {
	id: GOBLIN_LAIR.id,
	title: "The Alchemist Secret",
	loreDescription:
		"You found the supplies of an alchemist in Connury Town amidst the loot of a goblin band.",
	initialStepId: GOBLIN_LAIR.steps.bring_back_ledger,
	steps: {
		[GOBLIN_LAIR.steps.bring_back_ledger]: {
			id: GOBLIN_LAIR.steps.bring_back_ledger,
			logDescription: "Find the alchemist in Connury.",
			targetNodeId: [
				{
					mapNodeId: mapNodeId("connury_town"),
					locationId: townLocationId("alchemist_shop"),
				},
			],
			onEnterSceneId: GOBLIN_LAIR.scenes.meet_merchant,
		},
		[GOBLIN_LAIR.steps.find_the_goblin_lair]: {
			id: GOBLIN_LAIR.steps.find_the_goblin_lair,
			logDescription: "Track the goblin lair.",
			targetNodeId: [{ mapNodeId: mapNodeId("northern_road") }],
			onEnterSceneId: GOBLIN_LAIR.scenes.find_goblin_lair,
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
