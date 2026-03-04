import { questId, questStepId } from "@/modules/campaign/domain/quests.type";
import { townId } from "@/modules/towns/domain/towns.type";
import { encounterId } from "../../campaign/data/encounters.data";
import { type MapData, mapNodeId } from "../../world/domain/map.types";

export const WorldMapNodes: MapData = {
	// --- THE BASTION ---
    ironhold_city: {
        id: mapNodeId("ironhold_city"),
        name: "Ironhold City",
        type: "TOWN",
        townId: townId("ironhold_city"),
        position: { x: 50, y: 70 },
        connectedNodeIds: ["northern_logging_camp", "eastern_river_dam", "southern_trade_road"],
        background: "/bgs/ironhold_peaceful.jpg",
        variants: []
    },

    // --- FRONT 1: THE NORTH ---
    northern_logging_camp: {
        id: mapNodeId("northern_logging_camp"),
        name: "Overrun Logging Camp",
        type: "BATTLE",
        encounterId: encounterId("encounter_treant_bruisers"),
        position: { x: 50, y: 40 },
        connectedNodeIds: ["ironhold_city"],
        background: "/bgs/logging_camp_ruins.jpg",
        unlockCondition: { type: "HAS_FLAG", flagId: "invasion_stage_1" },
        variants: [
            {
                condition: { type: "HAS_FLAG", flagId: "north_cleared" },
                override: {
                    name: "Secured Lumber Yard",
                    type: "CAMP",
                    encounterId: undefined,
                    background: "/bgs/logging_camp_secured.jpg",
                }
            }
        ]
    },

    // --- FRONT 2: THE EAST ---
    eastern_river_dam: {
        id: mapNodeId("eastern_river_dam"),
        name: "Eastern River Dam",
        type: "BATTLE",
        encounterId: encounterId("encounter_elven_weavers"),
        position: { x: 75, y: 60 },
        connectedNodeIds: ["ironhold_city"],
        background: "/bgs/river_dam_hostile.jpg",
        unlockCondition: { type: "HAS_FLAG", flagId: "invasion_stage_1" },
        variants: [
            {
                condition: { type: "HAS_FLAG", flagId: "east_cleared" },
                override: {
                    name: "Silent Dam",
                    type: "CAMP",
                    encounterId: undefined,
                    background: "/bgs/river_dam_safe.jpg",
                }
            }
        ]
    },

    // --- FRONT 3: THE SOUTH ---
    southern_trade_road: {
        id: mapNodeId("southern_trade_road"),
        name: "Southern Trade Road",
        type: "BATTLE",
        encounterId: encounterId("encounter_beastmasters"), // Summoners!
        position: { x: 25, y: 80 }, // Bottom left
        connectedNodeIds: ["ironhold_city"],
        background: "/bgs/trade_road_ambush.jpg",
        unlockCondition: { type: "HAS_FLAG", flagId: "invasion_stage_1" },
        variants: [
            {
                condition: { type: "HAS_FLAG", flagId: "south_cleared" },
                override: {
                    name: "Cleared Trade Route",
                    type: "CAMP",
                    encounterId: undefined,
                    background: "/bgs/trade_road_safe.jpg",
                }
            }
        ]
    }
};
