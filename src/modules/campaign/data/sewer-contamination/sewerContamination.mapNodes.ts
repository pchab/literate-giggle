import { type MapData, mapNodeId } from "@/modules/world/domain/map.types";
import { SEWER_CONTAMINATION } from "./sewerContamination.definitions";

export const sewerContaminationMapNodes: MapData = {
	riverbend_village: {
		id: mapNodeId("riverbend_village"),
		name: "Riverbend village",
		position: { x: 56, y: 54 },
		type: "TOWN",
		connectedNodeIds: ["ironhold"],
		background: "grass_river_3_2",
		unlockCondition: [
			{
				type: "QUEST_ACTIVE",
				questId: SEWER_CONTAMINATION.id,
				stepId: [SEWER_CONTAMINATION.steps.travel_to_village],
			},
		],
	},
};
