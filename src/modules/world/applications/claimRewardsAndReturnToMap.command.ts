import type { WorldStoreServerAction } from "@/store/world.store";

export function claimRewardsAndReturnToMap(): WorldStoreServerAction {
	return ({ roster, pendingBattleLog }) => {
		if (!pendingBattleLog) return {};

		const newRoster = roster.map((hero) => {
			const cardsUsed = pendingBattleLog[hero.id] || {};

			return {
				...hero,
				deck: hero.deck.map((card) => {
					const timesUsed = cardsUsed[card.id] || 0;
					return {
						...card,
						xp: card.xp + timesUsed,
					};
				}),
			};
		});

		return {
			roster: newRoster,
			pendingBattleLog: {},
			phase: "MAP",
		};
	};
}
