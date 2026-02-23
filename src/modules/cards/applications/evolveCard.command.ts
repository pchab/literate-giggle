import { cardLibrary } from "@/modules/cards/domain/cards";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type { WorldStoreServerAction } from "@/store/world.store";

export function evolveCard(
	heroId: Hero["id"],
	oldCardId: Card["id"],
	newCardId: Card["id"],
): WorldStoreServerAction {
	return ({ roster }) => {
		const hero = roster.find((hero) => hero.id === heroId);
		const newCard = cardLibrary.find((card) => card.id === newCardId);
		if (!hero || !newCard) return {};
		const heroIndex = roster.findIndex((hero) => hero.id === heroId);
		const oldCardIndex = hero.deck.findIndex((card) => card.id === oldCardId);
		return {
			roster: roster.with(heroIndex, {
				...hero,
				deck: hero.deck.with(oldCardIndex, newCard),
			}),
		};
	};
}
