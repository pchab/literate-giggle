import type { Quest } from "../domain/quests.type";
import {
	DWARVEN_PASSAGE_QUEST,
	QUEST_DWARVEN_HIGHWAY,
} from "./dwarven-passage/dwarvenPassage.quest";
import {
	NECROMANCER_QUEST,
	NECROMANCER_QUEST_ID,
} from "./necromancer/necromancer.quest";
import { RAT_IN_THE_CELLAR } from "./rats-in-the-cellar/ratsInTheCellar.definitions";
import { RAT_IN_THE_CELLAR_QUEST } from "./rats-in-the-cellar/ratsInTheCellar.quest";
import { SHADOWS_DEBT } from "./shadows-debt/shadowsDebt.definitions";
import { SHADOWS_DEBT_QUEST } from "./shadows-debt/shadowsDebt.quest";
import {
	VERDANT_RECLAMATION,
	VERDANT_RECLAMATION_QUEST,
} from "./verdant-reclamation/verdantReclamation.quest";

export const QUEST_DB: Record<Quest["id"], Quest> = {
	[RAT_IN_THE_CELLAR.id]: RAT_IN_THE_CELLAR_QUEST,
	[VERDANT_RECLAMATION.id]: VERDANT_RECLAMATION_QUEST,
	[NECROMANCER_QUEST_ID]: NECROMANCER_QUEST,
	[QUEST_DWARVEN_HIGHWAY]: DWARVEN_PASSAGE_QUEST,
	[SHADOWS_DEBT.id]: SHADOWS_DEBT_QUEST,
};
