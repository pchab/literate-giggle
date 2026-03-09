import type { HeroCard } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type { RuneDraftOption } from "@/modules/figures/domain/heroClass.types";
import type { WorldState } from "../world.store";

export function resolvePowerRune(
	state: WorldState,
	heroId: Hero["id"],
	cardInstanceId: string,
	chosenRune: RuneDraftOption,
): Partial<WorldState> {
	const heroIndex = state.roster.findIndex((h) => h.id === heroId);
	if (heroIndex === -1) return {};

	const hero = state.roster[heroIndex];

	const deckIndex = hero.deck.findIndex((c) => c.instanceId === cardInstanceId);
	if (deckIndex === -1) return {};

	const newDeck = [...hero.deck];
	const targetCard = {
		...newDeck[deckIndex],
		powerRunes: { ...newDeck[deckIndex].powerRunes },
	};

	switch (chosenRune.type) {
		case "bonusDamage":
			targetCard.powerRunes.bonusDamage =
				(targetCard.powerRunes.bonusDamage || 0) + chosenRune.amount;
			break;
		case "bonusHeal":
			targetCard.powerRunes.bonusHeal =
				(targetCard.powerRunes.bonusHeal || 0) + chosenRune.amount;
			break;
		case "bonusRange":
			targetCard.powerRunes.bonusRange =
				(targetCard.powerRunes.bonusRange || 0) + chosenRune.amount;
			break;
		case "bonusStatusAmount":
			targetCard.powerRunes.bonusStatusAmount = {
				...targetCard.powerRunes.bonusStatusAmount,
				[chosenRune.statusType]:
					(targetCard.powerRunes.bonusStatusAmount?.[chosenRune.statusType] ||
						0) + chosenRune.amount,
			};
			break;
		case "bonusStatusDuration":
			targetCard.powerRunes.bonusStatusDuration = {
				...targetCard.powerRunes.bonusStatusDuration,
				[chosenRune.statusType]:
					(targetCard.powerRunes.bonusStatusDuration?.[chosenRune.statusType] ||
						0) + chosenRune.amount,
			};
			break;
	}

	newDeck[deckIndex] = targetCard;

	const newSelectedCards = [...hero.selectedCards] as [
		HeroCard,
		HeroCard | null,
		HeroCard | null,
	];
	const handIndex = newSelectedCards.findIndex(
		(c) => c?.instanceId === cardInstanceId,
	);
	if (handIndex !== -1) {
		newSelectedCards[handIndex] = targetCard;
	}

	const newRoster = [...state.roster];
	newRoster[heroIndex] = {
		...hero,
		deck: newDeck,
		selectedCards: newSelectedCards,
	};

	const newPendingRunes = [...state.pendingPowerRunes];
	const pendingIndex = newPendingRunes.findIndex((p) => p.heroId === heroId);
	if (pendingIndex !== -1) {
		newPendingRunes.splice(pendingIndex, 1);
	}

	return {
		roster: newRoster,
		pendingPowerRunes: newPendingRunes,
	};
}
