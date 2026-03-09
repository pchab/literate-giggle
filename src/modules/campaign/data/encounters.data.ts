import { skeleton } from "@/modules/figures/data/monsters/skeleton.data";
import type { Monster } from "@/modules/figures/domain/figures.type";
import { monsterId } from "@/modules/figures/helpers/figures.helpers";
import type { Scene } from "../domain/scenes.type";
import { VERDANT_RECLAMATION_ENCOUNTER_DB } from "./verdant-reclamation/verdantReclamation.encounters";
import { NECROMANCER_ENCOUNTER_DB } from './necromancer/necromancer.encounters';
import { DWARVEN_PASSAGE_ENCOUNTER_DB } from './dwarven-passage/dwarvenPassage.encounters';

export interface Encounter {
	id: string & { __brand: "EncounterId" };
	name: string;
	generateMonsters: () => Monster[];
	onWinSceneId?: Scene["id"];
	onLoseSceneId?: Scene["id"];
}

export function encounterId(id: string): Encounter["id"] {
	return `encounter-${id}` as Encounter["id"];
}

export const ENCOUNTER_DB: Record<string, Encounter> = {
	[encounterId("tutorial_fight")]: {
		id: encounterId("tutorial_fight"),
		name: "A lone skeleton",
		generateMonsters: () => [
			{
				...skeleton,
				id: monsterId("skel-1"),
				currentHp: 1,
				statuses: [],
				gridPosition: { col: 3, row: 3 },
			},
		],
	},

	...VERDANT_RECLAMATION_ENCOUNTER_DB,
	...NECROMANCER_ENCOUNTER_DB,
	...DWARVEN_PASSAGE_ENCOUNTER_DB,
};
