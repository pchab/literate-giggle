import { cardLibrary } from "@/modules/cards/data/cards.data";
import type { AnchorTarget } from "@/modules/cards/domain/cards.type";
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
		...state
	}) => {
		if (!activeCard) return {};

		const { heroId, cardId } = activeCard;
		const card = cardLibrary[cardId];
		if (!heroes.some((h) => h.id === heroId)) return {};

		let draftHeroes = [...heroes];
		let draftMonsters = [...monsters];
		let draftSummons = [...summons];
		const vfx: Record<string, VfxType> = {};

		card.effects.forEach((effect) => {
			switch (effect.type) {
				case "move":
					draftHeroes = resolveMoveEffect(
						effect,
						anchorTargetId,
						heroId,
						draftHeroes,
					);
					break;
				case "summon":
					draftSummons = resolveSummonEffect(
						effect,
						anchorTargetId,
						draftSummons,
					);
					break;
				case "push": {
					const pushResult = resolvePushEffect(
						effect,
						anchorTargetId,
						heroId,
						draftHeroes,
						draftMonsters,
						draftSummons,
					);
					draftHeroes = pushResult.heroes;
					draftMonsters = pushResult.monsters;
					break;
				}
				default: {
					const stdResult = resolveStandardEffect(
						effect,
						anchorTargetId,
						heroId,
						draftHeroes,
						draftMonsters,
						vfx,
					);
					draftHeroes = stdResult.heroes;
					draftMonsters = stdResult.monsters;
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
			enemyIntents: calculateAllIntents(draftHeroes, remainingMonsters),
			usedCardsThisTurn: { ...usedCardsThisTurn, [heroId]: cardId },
			usedMovesThisTurn: { ...usedMovesThisTurn, [heroId]: true },
			currentVfx: vfx,
			xpEarned: xpEarned + xpEarnedThisTurn,
		};
	};
}
