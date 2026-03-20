import { type MapData, mapNodeId } from "@/modules/world/domain/map.types";
import { THE_ALCHEMISTS_LEDGER } from "./alchemistsLedger.definitions";

export const alchemistsMapNodes: MapData = {
	goblin_lair: {
		id: mapNodeId("goblin_lair"),
		name: "Goblin Lair",
		position: { x: 72, y: 34 },
		type: "BATTLE",
		connectedNodeIds: ["northern_road"],
		background: "goblin_lair",
		encounterId: THE_ALCHEMISTS_LEDGER.encounters.goblin_shaman,
		unlockCondition: [
			{
				type: "QUEST_ACTIVE",
				questId: THE_ALCHEMISTS_LEDGER.id,
				stepId: [THE_ALCHEMISTS_LEDGER.steps.infiltrate_lab],
			},
		],
	},
};
