import { skeleton } from "@/modules/figures/data/monsters/skeleton.data";
import { monsterId } from "@/modules/figures/helpers/figures.helpers";
import { type Encounter, encounterId } from "../domain/encounters.type";
import { DWARVEN_PASSAGE_ENCOUNTER_DB } from "./dwarven-passage/dwarvenPassage.encounters";
import { NECROMANCER_ENCOUNTER_DB } from "./necromancer/necromancer.encounters";
import { RATS_IN_THE_CELLAR_ENCOUNTERS } from "./rats-in-the-cellar/ratsInTheCellar.encounters";
import { VERDANT_RECLAMATION_ENCOUNTER_DB } from "./verdant-reclamation/verdantReclamation.encounters";

export const ENCOUNTER_DB: Record<string, Encounter> = {
	[encounterId("tutorial_fight")]: {
		id: encounterId("tutorial_fight"),
		name: "A lone skeleton",
		generateMonsters: () => [
			{
				...skeleton,
				id: monsterId("skel-1"),
				currentHp: skeleton.maxHp,
				statuses: [],
				gridPosition: { col: 3, row: 3 },
			},
		],
	},

	...RATS_IN_THE_CELLAR_ENCOUNTERS,
	...VERDANT_RECLAMATION_ENCOUNTER_DB,
	...NECROMANCER_ENCOUNTER_DB,
	...DWARVEN_PASSAGE_ENCOUNTER_DB,
};
