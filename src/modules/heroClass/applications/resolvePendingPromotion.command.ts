import { cloneCard } from "@/modules/cards/cards.helper";
import { cardLibrary } from "@/modules/cards/domain/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import { CLASS_REGISTRY } from "@/modules/heroClass/domain/heroClass.data";
import type { WorldStoreServerAction } from "@/store/world.store";

export function resolvePendingPromotion(
	chosenUtilityCardId: Card["id"],
): WorldStoreServerAction {
	return ({ pendingPromotion, roster, ...state }) => {
		if (!pendingPromotion) return {};

		const heroIndex = roster.findIndex((h) => h.id === pendingPromotion.heroId);
		if (heroIndex === -1) return {};

		const hero = roster[heroIndex];
		const classDef = CLASS_REGISTRY[pendingPromotion.newClass];
		const cardTemplate = cardLibrary[chosenUtilityCardId];

		if (!classDef || !cardTemplate) {
			console.error("Missing class or card definition!");
			return {};
		}

		// 1. Create the new card and add to deck
		const newUtilityCard = cloneCard(cardTemplate);
		const nextDeck = [...hero.deck, newUtilityCard];

		// 2. Apply Class Upgrades
		return {
			...state,
			roster: roster.with(heroIndex, {
				...hero,
				heroClass: classDef.id,
				spriteBase: classDef.spriteBase,
				maxHp: hero.maxHp + classDef.bonusMaxHp,
				currentHp: hero.currentHp + classDef.bonusMaxHp, // Free heal!
				baseDef: hero.baseDef + classDef.bonusBaseDef,
				baseMove: hero.baseMove + classDef.bonusBaseMove,
				deck: nextDeck,
			}),
			pendingPromotion: null,
		};
	};
}
