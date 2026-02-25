import { cardLibrary } from "@/modules/cards/domain/cards";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { evaluateHeroClass } from "@/modules/heroClass/heroClass.helper";
import type { WorldStoreServerAction } from "@/store/world.store";
import { cloneCard } from "../cards.helper";

export function evolveCard(
	heroId: Hero["id"],
	oldCardId: Card["id"],
	newCardId: Card["id"],
): WorldStoreServerAction {
	return ({ roster, pendingPromotion }) => {
		const hero = roster.find((hero) => hero.id === heroId);
		const cardTemplate = cardLibrary.find((card) => card.id === newCardId);
		if (!hero || !cardTemplate) return {};

		const heroIndex = roster.findIndex((hero) => hero.id === heroId);
		const oldCardIndex = hero.deck.findIndex((card) => card.id === oldCardId);

		const [card1, card2] = hero.cards;
		const newCard = cloneCard(cardTemplate);

		const newDeck = hero.deck.with(oldCardIndex, newCard);
		const nextHeroClass = evaluateHeroClass(newDeck, hero.heroClass);
		const isPromotion = hero.heroClass !== nextHeroClass;

		return {
			roster: roster.with(heroIndex, {
				...hero,
				deck: newDeck,
				cards: oldCardId === card1.id ? [newCard, card2] : [card1, newCard],
			}),
			pendingPromotion: isPromotion
				? { heroId: hero.id, oldClass: hero.heroClass, newClass: nextHeroClass }
				: pendingPromotion,
		};
	};
}
