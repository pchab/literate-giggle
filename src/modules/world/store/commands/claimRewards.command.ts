import { CLASS_REGISTRY } from "@/modules/figures/data/heroClass.data";
import { applyLevelUpTriggers } from "@/modules/figures/helpers/levelUpEffects.helper";
import type { WorldStoreServerAction } from "@/modules/world/store/world.store";

export function claimRewards(earnedXp: number): WorldStoreServerAction {
	return ({ roster, pendingPromotions, unlockedQuestsQueue }) => {
		let newPendingPromotions = [...pendingPromotions];
		let newUnlockedQuestsQueue = [...unlockedQuestsQueue];

		const newRoster = roster.map((hero) => {
			const classDef = CLASS_REGISTRY[hero.heroClass];
			let newHero = { ...hero, currentXp: hero.currentXp + earnedXp };

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

			return newHero;
		});

		return {
			roster: newRoster,
			pendingPromotions: newPendingPromotions,
			unlockedQuestsQueue: newUnlockedQuestsQueue,
		};
	};
}
