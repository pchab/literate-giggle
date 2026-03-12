import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import type { Encounter } from "@/modules/campaign/domain/encounters.type";
import { getComputedCard } from "@/modules/cards/helpers/cards.helper";
import {
	type Allegiance,
	type BattleHero,
	type Hero,
	type Monster,
	type Summon,
	type UnitBlueprint,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import { monsterId, summonId } from "@/modules/figures/helpers/figures.helpers";
import { ENCOUNTER_DB } from "../../../campaign/data/encounters.data";
import type { GridPosition } from "../../domain/grid.type";
import { calculateAIIntents } from "./calculateAIIntents.command";

const startingGridPosition = [
	{ col: 1, row: 0 },
	{ col: 0, row: 1 },
	{ col: 1, row: 1 },
];

const bluePrintToMonster = (
	blueprint: UnitBlueprint & { gridPosition: GridPosition },
): Monster => ({
	...blueprint,
	id: monsterId(crypto.randomUUID()),
	currentHp: blueprint.maxHp,
	statuses: [],
	stance: UnitStance.IDLE,
});
const bluePrintToSummon = (
	blueprint: UnitBlueprint & {
		gridPosition: GridPosition;
		allegiance: Allegiance;
	},
): Summon => ({
	...blueprint,
	id: summonId(crypto.randomUUID()),
	currentHp: blueprint.maxHp,
	statuses: [],
	stance: UnitStance.IDLE,
});

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
		const {
			generateMonsters,
			generateSummons = () => [],
			surfaces = {},
		} = encounter;

		const freshMonsters = generateMonsters().map(bluePrintToMonster);
		const freshSummons = generateSummons().map(bluePrintToSummon);

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
			summons: freshSummons,
			surfaces,
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
