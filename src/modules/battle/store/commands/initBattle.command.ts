import type { BattleGet, BattleSet } from "@/modules/battle/store/battle.store";
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
} from "@/modules/units/domain/units.type";
import {
	getVariantFromBlueprint,
	monsterId,
	summonId,
} from "@/modules/units/helpers/units.helpers";
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
	variant: getVariantFromBlueprint(blueprint),
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
	variant: getVariantFromBlueprint(blueprint),
	id: summonId(crypto.randomUUID()),
	currentHp: blueprint.maxHp,
	statuses: [],
	stance: UnitStance.IDLE,
});

export const initBattle =
	(get: BattleGet, set: BattleSet) =>
	async (roster: Hero[], encounterId: Encounter["id"]) => {
		const encounter = ENCOUNTER_DB[encounterId];

		if (!encounter) {
			console.error(`Encounter ${encounterId} not found!`);
			return;
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
		set(() => ({
			encounterId,
			units: [...battleRoster, ...freshMonsters, ...freshSummons],
			surfaces,
			activeHeroCard: null,
			activeMoveHeroId: null,
			usedCardsThisTurn: {},
			usedMovesThisTurn: {},
			hoveredCell: null,
			xpEarned: 0,
			battleStatus: "ONGOING",
			objectiveProgress: {},
			gridSize: encounter.gridSize || { cols: 5, rows: 5 },
		}));
		await calculateAIIntents(get, set)({});
	};
