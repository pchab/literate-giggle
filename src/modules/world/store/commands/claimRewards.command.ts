import { CLASS_REGISTRY } from "@/modules/units/data/heroClass.data";
import {
	EMPTY_DRAFT_RESULT,
	type HeroDraftResult,
} from "@/modules/units/domain/heroClass.types";
import type { Hero } from "@/modules/units/domain/units.type";
import { applyDraftResult } from "@/modules/units/helpers/draft.helper";
import { applyLevelUpTriggers } from "@/modules/units/helpers/levelUpEffects.helper";
import type { WorldStoreServerAction } from "@/modules/world/store/world.store";

export function claimRewards(
	earnedXp: number,
	completedDraft: Record<Hero["id"], HeroDraftResult>,
): WorldStoreServerAction {
	return ({ roster, pendingPromotions, unlockedQuestsQueue }) => {
		let newPendingPromotions = [...pendingPromotions];
		let newUnlockedQuestsQueue = [...unlockedQuestsQueue];

		const newRoster = roster.map((hero) => {
			const classDef = CLASS_REGISTRY[hero.heroClass];
			let newHero = { ...hero, currentXp: hero.currentXp + earnedXp };

			// 1. Handle standard Level Ups
			while (
				classDef.xpThresholds[newHero.currentLevel] !== undefined &&
				newHero.currentXp >= classDef.xpThresholds[newHero.currentLevel]
			) {
				const triggersToApply =
					classDef.levelUpTriggers[newHero.currentLevel] || [];

				({
					hero: newHero,
					pendingPromotions: newPendingPromotions,
					unlockedQuestsQueue: newUnlockedQuestsQueue,
				} = triggersToApply.reduce(applyLevelUpTriggers, {
					hero: newHero,
					pendingPromotions: newPendingPromotions,
					unlockedQuestsQueue: newUnlockedQuestsQueue,
				}));

				newHero.currentXp -= classDef.xpThresholds[newHero.currentLevel];
				newHero.currentLevel++;

				// Heal on level up
				if (newHero.currentLevel > hero.currentLevel) {
					newHero.currentHp = newHero.maxHp;
				}
			}

			// 2. Apply the reward-screen picks (learned cards, passives, runes)
			newHero = applyDraftResult(
				newHero,
				completedDraft[hero.id] ?? EMPTY_DRAFT_RESULT,
			);

			return newHero;
		});

		return {
			roster: newRoster,
			pendingPromotions: newPendingPromotions,
			unlockedQuestsQueue: newUnlockedQuestsQueue,
		};
	};
}
