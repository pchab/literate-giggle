import { cardLibrary } from "@/modules/cards/data/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import { CLASS_REGISTRY } from "@/modules/figures/data/heroClass.data";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { applyLevelUpTriggers } from "@/modules/figures/helpers/levelUpEffects.helper";
import type { WorldStoreServerAction } from "@/modules/world/store/world.store";
import type { HeroClass } from "../../../figures/domain/heroClass.types";

export function resolvePendingPromotion(
	heroId: Hero["id"],
	chosenClass: HeroClass,
	chosenUtilityCardId: Card["id"],
): WorldStoreServerAction {
	return ({ pendingPromotions, unlockedQuestsQueue, roster, ...state }) => {
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
		const {
			hero: newHero,
			pendingPromotions: newPendingPromotions,
			unlockedQuestsQueue: newUnlockedQuestsQueue,
		} = triggers.reduce(applyLevelUpTriggers, {
			hero,
			pendingPromotions,
			unlockedQuestsQueue,
		});

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
			pendingPromotions: newPendingPromotions.filter(
				(p) => p.heroId !== heroId,
			),
			unlockedQuestsQueue: newUnlockedQuestsQueue,
		};
	};
}
