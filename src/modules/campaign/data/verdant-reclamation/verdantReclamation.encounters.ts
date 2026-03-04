import type { Monster } from "@/modules/figures/domain/figures.type";
import { Encounter } from "../encounters.data";
import { treant } from "@/modules/figures/data/monsters/treant.data";
import { elvenWeaver } from "@/modules/figures/data/monsters/elven-weaver";
import { beastMaster } from "@/modules/figures/data/monsters/beast-master";

export const ENCOUNTER_DB: Record<string, Encounter> = {
    
    // --- FRONT 1: THE NORTH (Push Mechanics) ---
    encounter_treant_bruisers: {
        id: "encounter_treant_bruisers" as any,
        name: "Overrun Logging Camp",
        generateMonsters: (): Monster[] => [
            {
                id: "treant_1" as any,
                ...treant,
                currentHp: treant.maxHp,
                gridPosition: { col: 3, row: 3 },
            },
            {
                id: "treant_2" as any,
                ...treant,
                currentHp: treant.maxHp,
                gridPosition: { col: 4, row: 4 },
            }
        ]
    },

    // --- FRONT 2: THE EAST (Agile / Standard Damage) ---
    encounter_elven_weavers: {
        id: "encounter_elven_weavers" as any,
        name: "Eastern River Dam",
        generateMonsters: (): Monster[] => [
            {
                id: "weaver_1" as any,
                ...elvenWeaver,
                currentHp: elvenWeaver.maxHp,
                gridPosition: { col: 3, row: 3 },
            }
        ]
    },

    // --- FRONT 3: THE SOUTH (Summon Mechanics) ---
    encounter_beastmasters: {
        id: "encounter_beastmasters" as any,
        name: "Southern Trade Road",
        generateMonsters: (): Monster[] => [
            {
                id: "beastmaster_1" as any,
                ...beastMaster,
                currentHp: beastMaster.maxHp,
                gridPosition: { col: 3, row: 3 },
            }
        ]
    }
};