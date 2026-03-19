import type { Encounter } from "../domain/encounters.type";
import { DWARVEN_PASSAGE_ENCOUNTER_DB } from "./dwarven-passage/dwarvenPassage.encounters";
import { GOBLIN_LAIR_ENCOUNTERS } from "./goblin-lair/goblinLair.encounters";
import { NECROMANCER_ENCOUNTER_DB } from "./necromancer/necromancer.encounters";
import { RATS_IN_THE_CELLAR_ENCOUNTERS } from "./rats-in-the-cellar/ratsInTheCellar.encounters";
import { SHADOWS_DEBT_ENCOUNTERS } from "./shadows-debt/shadowsDebt.encounters";
import { VERDANT_RECLAMATION_ENCOUNTER_DB } from "./verdant-reclamation/verdantReclamation.encounters";

export const ENCOUNTER_DB: Record<string, Encounter> = {
	...RATS_IN_THE_CELLAR_ENCOUNTERS,
	...VERDANT_RECLAMATION_ENCOUNTER_DB,
	...NECROMANCER_ENCOUNTER_DB,
	...DWARVEN_PASSAGE_ENCOUNTER_DB,
	...SHADOWS_DEBT_ENCOUNTERS,
	...GOBLIN_LAIR_ENCOUNTERS,
};
