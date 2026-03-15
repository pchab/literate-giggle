import type { AnchorTarget } from "@/modules/cards/domain/cards.type";
import {
	type BattleHero,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import type { GridPosition } from "../../domain/grid.type";
import { resolvers } from "../../helpers/effects/effect.resolvers";
import { rotatePattern } from "../../helpers/grid.helpers";
import { updateBattleUnitState } from "../../helpers/state.helpers";
import type { StoreGet, StoreSet } from "../battle.store";
import { calculateAIIntents } from "./calculateAIIntents.command";

const updateHeroStance =
	(get: StoreGet, set: StoreSet) =>
	(heroId: BattleHero["id"]) =>
	(stance: UnitStance) => {
		const freshHero = [...get().heroes].find(({ id }) => id === heroId);
		if (!freshHero) return;
		updateBattleUnitState(set)({ ...freshHero, stance });
		return freshHero;
	};

export const resolveCard =
	(get: StoreGet, set: StoreSet) => async (anchorTarget: AnchorTarget) => {
		const { activeHeroCard: activeCard, heroes } = get();
		if (!activeCard) return;

		const { unitId, card } = activeCard;
		const hero = heroes.find((h) => h.id === unitId);
		if (!hero) return;

		// --- 2. CALCULATE THE BLAST ZONE ---
		let patternCells: GridPosition[] | undefined;
		if (card.aoePattern && anchorTarget) {
			const rotatedPattern = rotatePattern(
				card.aoePattern,
				hero.gridPosition,
				anchorTarget,
			);

			patternCells = rotatedPattern.map((p) => ({
				col: anchorTarget.col + p.col,
				row: anchorTarget.row + p.row,
			}));
		}

		// --- 3. RESOLVE EFFECTS WITH PATTERN ---
		for (const effect of card.effects) {
			await resolvers(effect)(get, set)({
				anchorTarget,
				caster: hero,
				patternCells,
			});
		}
		updateHeroStance(get, set)(unitId)(UnitStance.IDLE);

		// --- 4. CLEAN UP ---

		set(
			({
				heroes,
				monsters,
				summons,
				aiIntents,
				usedCardsThisTurn,
				usedMovesThisTurn,
				xpEarned,
				...prev
			}) => {
				const deadMonsters = monsters.filter((m) => m.currentHp <= 0);
				const xpEarnedThisTurn = deadMonsters.reduce(
					(acc, m) => acc + m.xpReward,
					0,
				);
				const remainingHeroes = heroes.filter((h) => h.currentHp > 0);
				const remainingMonsters = monsters.filter((m) => m.currentHp > 0);
				const remainingSummons = summons.filter((m) => m.currentHp > 0);
				return {
					...prev,
					activeHeroCard: null,
					monsters: remainingMonsters,
					summons: remainingSummons,
					aiIntents: calculateAIIntents(
						[...remainingHeroes, ...remainingMonsters, ...summons],
						aiIntents,
					),
					usedCardsThisTurn: { ...usedCardsThisTurn, [hero.id]: card },
					usedMovesThisTurn: { ...usedMovesThisTurn, [hero.id]: 99 },
					xpEarned: xpEarned + xpEarnedThisTurn,
				};
			},
		);
	};
