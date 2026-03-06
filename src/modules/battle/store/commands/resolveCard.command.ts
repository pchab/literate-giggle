import { cardLibrary } from "@/modules/cards/data/cards.data";
import type { AnchorTarget } from "@/modules/cards/domain/cards.type";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";
import type { VfxType } from "../../domain/vfx.type";
import {
	resolveMoveEffect,
	resolvePushEffect,
	resolveStandardEffect,
	resolveSummonEffect,
} from "../../helpers/effect.resolvers";
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
		enemyIntents,
		...state
	}) => {
		if (!activeCard) return {};

		const { heroId, cardId } = activeCard;
		const card = cardLibrary[cardId];
		const hero = heroes.find((h) => h.id === heroId);
		if (!hero) return {};

		let draftHeroes = [...heroes];
		let draftMonsters = [...monsters];
		let draftSummons = [...summons];
		const vfx: Record<string, VfxType> = {};

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
					draftSummons = resolveSummonEffect({
						effect,
						anchorTargetId,
						caster: hero,
						figures: draftSummons,
						vfx,
					}).figures;
					break;
				case "push": {
					const pushResult = resolvePushEffect({
						effect,
						anchorTargetId,
						caster: hero,
						figures: [...draftHeroes, ...draftMonsters, ...draftSummons],
						vfx,
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
			enemyIntents: calculateAllIntents(draftHeroes, remainingMonsters, draftSummons, enemyIntents),
			usedCardsThisTurn: { ...usedCardsThisTurn, [heroId]: cardId },
			usedMovesThisTurn: { ...usedMovesThisTurn, [heroId]: true },
			currentVfx: vfx,
			xpEarned: xpEarned + xpEarnedThisTurn,
		};
	};
}
