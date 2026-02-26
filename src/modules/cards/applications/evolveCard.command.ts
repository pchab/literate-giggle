import { cardLibrary } from "@/modules/cards/domain/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type { WorldStoreServerAction } from "@/store/world.store";
import { cloneCard } from "../cards.helper";

export function evolveCard(
	heroId: Hero["id"],
	oldCardId: Card["id"],
	newCardBlueprintId: Card["id"],
): WorldStoreServerAction {
	return ({ roster, pendingPromotion, ...state }) => {
		const heroIndex = roster.findIndex((hero) => hero.id === heroId);
		if (heroIndex === -1) return {};

		const hero = roster[heroIndex];

		const cardTemplate = cardLibrary[newCardBlueprintId];
		if (!cardTemplate) return {};

		const oldDeckIndex = hero.deck.findIndex((card) => card.id === oldCardId);
		if (oldDeckIndex === -1) return {};

		const newCard = cloneCard(cardTemplate);
		const newDeck = hero.deck.with(oldDeckIndex, newCard);

		// --- 1. HANDLE THE 3-CARD HAND ---
		const oldHandIndex = hero.cards.findIndex((card) => card?.id === oldCardId);
		const nextCards = [...hero.cards] as [Card, Card, Card];

		// If the leveled-up card was currently equipped, update it in the hand
		if (oldHandIndex !== -1) {
			nextCards[oldHandIndex] = newCard;
		}

		// --- 2. HANDLE PASSIVE UNLOCKS ---
		// (Make sure to add `passives: string[]` to your Hero type!)
		const nextPassives = hero.passives ? [...hero.passives] : [];
		let nextMaxHp = hero.maxHp;
		let nextCurrentHp = hero.currentHp;
		let nextBaseMove = hero.baseMove;

		if (
			cardTemplate.grantsPassive &&
			!nextPassives.includes(cardTemplate.grantsPassive)
		) {
			nextPassives.push(cardTemplate.grantsPassive);

			// Apply the immediate stat bumps based on the passive!
			// (You'll likely move this to a helper function later, but this shows the logic)
			if (cardTemplate.grantsPassive === "passive-toughened") {
				nextMaxHp += 2;
				nextCurrentHp += 2;
			} else if (cardTemplate.grantsPassive === "passive-fleet-footed") {
				nextBaseMove += 1;
			}
		}

		// --- 3. HANDLE CLASS PROMOTION ---
		const nextHeroClass = cardTemplate.promotesToClass;

		return {
			...state,
			roster: roster.with(heroIndex, {
				...hero,
				deck: newDeck,
				cards: nextCards,
				passives: nextPassives,
				maxHp: nextMaxHp,
				currentHp: nextCurrentHp,
				baseMove: nextBaseMove,
			}),
			pendingPromotion: nextHeroClass
				? { heroId: hero.id, oldClass: hero.heroClass, newClass: nextHeroClass }
				: pendingPromotion,
		};
	};
}
