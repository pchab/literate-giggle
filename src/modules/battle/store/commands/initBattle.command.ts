import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import type { Encounter } from "@/modules/campaign/domain/encounters.type";
import { getComputedCard } from "@/modules/cards/helpers/cards.helper";
import {
	type BattleHero,
	type Hero,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import { ENCOUNTER_DB } from "../../../campaign/data/encounters.data";
import { calculateAIIntents } from "./calculateAIIntents.command";

const startingGridPosition = [
	{ col: 1, row: 0 },
	{ col: 0, row: 1 },
	{ col: 1, row: 1 },
];

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

		const battleRoster: BattleHero[] = roster.map((hero, index) => {
			const [card1, card2, card3] = hero.selectedCards
				.filter((c) => !!c)
				.map(getComputedCard);
			if (!card1) {
				throw new Error(`Error instanciating card ${hero.selectedCards[0]}`);
			}
			return {
				...hero,
				stance: UnitStance.IDLE,
				gridPosition: startingGridPosition[index],
				statuses: [],
				hand: [card1, card2, card3],
			};
		});
		const initialIntents = calculateAIIntents(
			[...battleRoster, ...freshMonsters],
			{},
		);
		return {
			encounterId,
			heroes: battleRoster,
			monsters: freshMonsters,
			summons: [],
			surfaces: {},
			aiIntents: initialIntents,
			activeCard: null,
			activeMoveUnitId: null,
			usedCardsThisTurn: {},
			usedMovesThisTurn: {},
			hoveredCard: null,
			xpEarned: 0,
			background,
		};
	};
}
