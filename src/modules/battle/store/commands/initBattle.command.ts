import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { ENCOUNTER_DB, type Encounter } from "../../../campaign/data/encounters.data";
import { calculateAllIntents } from "./calculateAllIntents.command";

export function initBattle(
	roster: Hero[],
	encounterId: Encounter["id"],
	background: string,
): BattleStoreServerAction {
	return () => {
		const encounter = ENCOUNTER_DB[encounterId];

		if (!encounter) {
			console.error(`Encounter ${encounterId} not found!`);
			return {};
		}

		const freshMonsters = encounter.generateMonsters();

		const initialIntents = calculateAllIntents(roster, freshMonsters);

		return {
			heroes: roster,
			monsters: freshMonsters,
			enemyIntents: initialIntents,
			activeCard: null,
			activeMoveHeroId: null,
			usedCardsThisTurn: {},
			usedMovesThisTurn: {},
			hoveredCard: null,
			xpEarned: 0,
			background,
		};
	};
}
