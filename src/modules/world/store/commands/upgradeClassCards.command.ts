import type { Card, Hand } from "@/modules/cards/domain/cards.type";
import type { WorldStoreServerAction } from "../world.store";

export function upgradeClassCards(
	cardUpgrades: Record<Card["id"], Card["id"]>,
): WorldStoreServerAction {
	return ({ roster }) => {
		const nextRoster = roster.map(({ deck, hand, ...hero }) => {
			const upgradedDeck = deck.map((cardId) => {
				return cardUpgrades[cardId] || cardId;
			});
			const upgradedHand = hand.map((cardId) => {
				if (!cardId) return null;
				return cardUpgrades[cardId] || cardId;
			}) as Hand;

			return { ...hero, deck: upgradedDeck, hand: upgradedHand };
		});

		return { roster: nextRoster };
	};
}
