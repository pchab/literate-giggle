import { cardLibrary } from "@/modules/cards/domain/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { CLASS_REGISTRY } from "@/modules/heroClass/domain/heroClass.data";
import type { WorldStoreServerAction } from "@/store/world.store";
import type { HeroClass } from "../domain/heroClass.types";
import { applyLevelUpTriggers } from "../levelUpEffects.helper";

export function resolvePendingPromotion(
    heroId: Hero["id"],
    chosenClass: HeroClass,
    chosenUtilityCardId: Card["id"],
): WorldStoreServerAction {
    return ({ pendingPromotions, roster, ...state }) => {
        if (!pendingPromotions.length) return {};

        const heroIndex = roster.findIndex((h) => h.id === heroId);
        if (heroIndex === -1) return {};

        const hero = roster[heroIndex];
        const classDef = CLASS_REGISTRY[chosenClass];

        if (!classDef) {
            console.error("Missing class definition!");
            return {};
        }

        const triggers = classDef.levelUpTriggers[0] || [];
        let { hero: newHero, pendingPromotions: newPendingPromotions } = triggers.reduce(applyLevelUpTriggers, { hero, pendingPromotions });

        if (cardLibrary[chosenUtilityCardId]) {
            newHero.deck.push(chosenUtilityCardId);
        }
        return {
            ...state,
            roster: roster.with(heroIndex, {
                ...newHero,
                heroClass: classDef.id,
                spriteBase: classDef.spriteBase,
            }),
            pendingPromotions: newPendingPromotions.filter((p) => p.heroId !== heroId),
        };
    };
}