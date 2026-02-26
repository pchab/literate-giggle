import { intentService } from "@/modules/attacks/intents.service";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type { BattleStoreServerAction } from "@/store/battle.store";
import { ENCOUNTER_DB, type Encounter } from "../encounters.data";

export function initBattle(
	roster: Hero[],
	encounterId: Encounter["id"],
): BattleStoreServerAction {
	return () => {
		const encounter = ENCOUNTER_DB[encounterId];

		if (!encounter) {
			console.error(`Encounter ${encounterId} not found!`);
			return {};
		}

		const freshMonsters = encounter.generateMonsters();

		const initialIntents = intentService.calculateAllIntents(
			roster,
			freshMonsters,
		);

		return {
			heroes: roster,
			monsters: freshMonsters,
			enemyIntents: initialIntents,
			activeCard: null,
			activeMoveHeroId: null,
			usedCardsThisTurn: {},
			usedMovesThisTurn: {},
			cardUsageLog: {},
			hoveredCard: null,
		};
	};
}
