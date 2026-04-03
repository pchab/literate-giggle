import { type MapData, mapNodeId } from "@/modules/world/domain/map.types";
import { QUEST_4B_ZOMBIE_RIVERBEND } from "./sewerContamination.definitions";

export const sewerContaminationMapNodes: MapData = {
	riverbend_village: {
		id: mapNodeId("riverbend_village"),
		name: "Riverbend village",
		position: { x: 54, y: 50 },
		type: "TOWN",
		connectedNodeIds: ["ironhold"],
		background: "grass_river_3_2",
		unlockCondition: [
			{
				type: "QUEST_ACTIVE",
				questId: QUEST_4B_ZOMBIE_RIVERBEND.id,
				stepId: [QUEST_4B_ZOMBIE_RIVERBEND.steps.travel_to_village],
			},
		],
	},
};
