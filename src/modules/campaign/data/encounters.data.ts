import { goblin } from "@/modules/figures/data/monsters/goblin.data";
import { monsterId } from "@/modules/figures/helpers/figures.helpers";
import { type Encounter, encounterId } from "../domain/encounters.type";
import { DWARVEN_PASSAGE_ENCOUNTER_DB } from "./dwarven-passage/dwarvenPassage.encounters";
import { NECROMANCER_ENCOUNTER_DB } from "./necromancer/necromancer.encounters";
import { RATS_IN_THE_CELLAR_ENCOUNTERS } from "./rats-in-the-cellar/ratsInTheCellar.encounters";
import { VERDANT_RECLAMATION_ENCOUNTER_DB } from "./verdant-reclamation/verdantReclamation.encounters";

export const ENCOUNTER_DB: Record<string, Encounter> = {
	[encounterId("tutorial_fight")]: {
		id: encounterId("tutorial_fight"),
		name: "Three Goblins",
		generateMonsters: () => [
			{
				...goblin,
				id: monsterId("gob-1"),
				currentHp: goblin.maxHp,
				statuses: [],
				gridPosition: { col: 3, row: 3 },
			},
			{
				...goblin,
				id: monsterId("gob-2"),
				currentHp: goblin.maxHp,
				statuses: [],
				gridPosition: { col: 4, row: 3 },
			},
			{
				...goblin,
				id: monsterId("gob-3"),
				currentHp: goblin.maxHp,
				statuses: [],
				gridPosition: { col: 3, row: 4 },
			},
		],
	},

	...RATS_IN_THE_CELLAR_ENCOUNTERS,
	...VERDANT_RECLAMATION_ENCOUNTER_DB,
	...NECROMANCER_ENCOUNTER_DB,
	...DWARVEN_PASSAGE_ENCOUNTER_DB,
};
