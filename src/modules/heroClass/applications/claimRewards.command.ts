import { CLASS_REGISTRY } from "@/modules/heroClass/domain/heroClass.data";
import type { WorldStoreServerAction } from "@/store/world.store";
import { applyLevelUpTriggers } from "../levelUpEffects.helper";

export function claimRewards(earnedXp: number): WorldStoreServerAction {
    return ({ roster, pendingPromotions }) => {
        let newPendingPromotions = [...pendingPromotions];
        
        const newRoster = roster.map((hero) => {
            const classDef = CLASS_REGISTRY[hero.heroClass];
            let newHero = { ...hero, currentXp: hero.currentXp + earnedXp };

            while (
                classDef.xpThresholds[newHero.currentLevel] !== undefined &&
                newHero.currentXp >= classDef.xpThresholds[newHero.currentLevel]
            ) {
                const triggersToApply = classDef.levelUpTriggers[newHero.currentLevel] || [];

                ({ hero: newHero, pendingPromotions: newPendingPromotions } = triggersToApply.reduce(applyLevelUpTriggers, { hero: newHero, pendingPromotions: newPendingPromotions }));
                
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
        };
    };
}