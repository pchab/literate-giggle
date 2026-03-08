import {
	type AnchorTarget,
	anchorIsGridPosition,
} from "@/modules/cards/domain/cards.type";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";
import type { GridPosition } from "../../domain/grid.type"; // Ensure you have this imported
import type { VfxType } from "../../domain/vfx.type";
import {
	resolveMoveEffect,
	resolvePushEffect,
	resolveStandardEffect,
	resolveSummonEffect,
} from "../../helpers/effect.resolvers";
import { rotatePattern } from "../../helpers/grid.helpers";
import type { BattleStoreServerAction } from "../battle.store";
import { calculateAllIntents } from "./calculateAllIntents.command";

export function resolveCard(
	anchorTargetId: AnchorTarget | null,
): BattleStoreServerAction {
	return ({
		activeCard,
		heroes,
		monsters,
		summons,
		usedCardsThisTurn,
		usedMovesThisTurn,
		xpEarned,
		aiIntents: enemyIntents,
		...state
	}) => {
		if (!activeCard) return {};

		const { heroId, card } = activeCard;
		const hero = heroes.find((h) => h.id === heroId);
		if (!hero) return {};

		let draftHeroes = [...heroes];
		let draftMonsters = [...monsters];
		let draftSummons = [...summons];
		const vfx: Record<string, VfxType> = {};

		// --- 1. DETERMINE THE EPICENTER OF THE AOE ---
		let targetPos: GridPosition | null = null;
		if (anchorTargetId) {
			if (anchorIsGridPosition(anchorTargetId)) {
				targetPos = anchorTargetId;
			} else if (typeof anchorTargetId === "string") {
				const allFigures = [...draftHeroes, ...draftMonsters, ...draftSummons];
				const targetFigure = allFigures.find((f) => f.id === anchorTargetId);
				if (targetFigure) {
					targetPos = targetFigure.gridPosition;
				}
			}
		}

		// --- 2. CALCULATE THE BLAST ZONE ---
		let patternCells: GridPosition[] | undefined;
		if (card.aoePattern && targetPos) {
			const rotatedPattern = rotatePattern(
				card.aoePattern,
				hero.gridPosition,
				targetPos,
			);

			patternCells = rotatedPattern.map((p) => ({
				col: targetPos.col + p.col,
				row: targetPos.row + p.row,
			}));
		}

		// --- 3. RESOLVE EFFECTS WITH PATTERN ---
		card.effects.forEach((effect) => {
			switch (effect.type) {
				case "move":
					draftHeroes = resolveMoveEffect({
						effect,
						anchorTargetId,
						caster: hero,
						figures: draftHeroes,
						vfx,
					}).figures;
					break;
				case "summon":
					draftSummons =
						resolveSummonEffect({
							effect,
							anchorTargetId,
							caster: hero,
							figures: draftSummons,
							vfx,
						}).figures || draftSummons;
					break;
				case "push": {
					const pushResult = resolvePushEffect({
						effect,
						anchorTargetId,
						caster: hero,
						figures: [...draftHeroes, ...draftMonsters, ...draftSummons],
						vfx,
						patternCells,
					});
					draftHeroes = pushResult.figures.filter((f) => isHero(f));
					draftMonsters = pushResult.figures.filter((f) => isMonster(f));
					draftSummons = pushResult.figures.filter((f) => isSummon(f));
					break;
				}
				default: {
					const stdResult = resolveStandardEffect({
						effect,
						anchorTargetId,
						caster: hero,
						figures: [...draftHeroes, ...draftMonsters, ...draftSummons],
						vfx,
						patternCells,
					});
					draftHeroes = stdResult.figures.filter((f) => isHero(f));
					draftMonsters = stdResult.figures.filter((f) => isMonster(f));
					draftSummons = stdResult.figures.filter((f) => isSummon(f));
					break;
				}
			}
		});

		const deadMonsters = draftMonsters.filter((m) => m.currentHp <= 0);
		const xpEarnedThisTurn = deadMonsters.reduce(
			(acc, m) => acc + m.xpReward,
			0,
		);
		const remainingMonsters = draftMonsters.filter((m) => m.currentHp > 0);

		return {
			...state,
			activeCard: null,
			heroes: draftHeroes,
			monsters: remainingMonsters,
			summons: draftSummons,
			aiIntents: calculateAllIntents(
				draftHeroes,
				remainingMonsters,
				draftSummons,
				enemyIntents,
			),
			usedCardsThisTurn: { ...usedCardsThisTurn, [heroId]: card },
			usedMovesThisTurn: { ...usedMovesThisTurn, [heroId]: true },
			currentVfx: vfx,
			xpEarned: xpEarned + xpEarnedThisTurn,
		};
	};
}
