import type { AnchorTarget } from "@/modules/cards/domain/cards.type";
import { UnitStance } from "@/modules/figures/domain/figures.type";
import { sleep } from "@/modules/shared/helpers/sleep";
import type { GridPosition } from "../../domain/grid.type";
import { resolvers } from "../../helpers/effects/effect.resolvers";
import { rotatePattern } from "../../helpers/grid.helpers";
import { updateBattleUnitState } from "../../helpers/state.helpers";
import type { StoreGet, StoreSet } from "../battle.store";
import { calculateAIIntents } from "./calculateAIIntents.command";

export const resolveCard =
	(get: StoreGet, set: StoreSet) => async (anchorTarget: AnchorTarget) => {
		const { activeCard, heroes } = get();
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
		const attackingUnit = { ...hero, stance: UnitStance.ATTACKING };
		updateBattleUnitState(set)(attackingUnit);
		await sleep(300);
		for (const effect of card.effects) {
			await resolvers(effect)(get, set)({
				anchorTarget,
				caster: hero,
				patternCells,
			});
		}
		const stillUnit = { ...hero, stance: UnitStance.IDLE };
		updateBattleUnitState(set)(stillUnit);

		// --- 4. CLEAN UP ---
		const { heroes: newHeroes, monsters, summons } = get();
		const deadMonsters = monsters.filter((m) => m.currentHp <= 0);
		const xpEarnedThisTurn = deadMonsters.reduce(
			(acc, m) => acc + m.xpReward,
			0,
		);
		const remainingMonsters = monsters.filter((m) => m.currentHp > 0);

		set(
			({
				aiIntents,
				usedCardsThisTurn,
				usedMovesThisTurn,
				xpEarned,
				...prev
			}) => ({
				...prev,
				activeCard: null,
				monsters: remainingMonsters,
				aiIntents: calculateAIIntents(
					[...newHeroes, ...remainingMonsters, ...summons],
					aiIntents,
				),
				usedCardsThisTurn: { ...usedCardsThisTurn, [hero.id]: card },
				usedMovesThisTurn: { ...usedMovesThisTurn, [hero.id]: 99 },
				xpEarned: xpEarned + xpEarnedThisTurn,
			}),
		);
	};
