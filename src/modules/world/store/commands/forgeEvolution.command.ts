import {
	EVOLUTION_RECIPES,
	type EvolutionRuneId,
} from "@/modules/cards/data/evolutionRecipes.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/units/domain/units.type";
import type { WorldState } from "../world.store";

export function forgeEvolution(
	state: WorldState,
	heroId: Hero["id"],
	cardInstanceId: string,
	runeId: EvolutionRuneId,
): Partial<WorldState> {
	const heroIndex = state.roster.findIndex((h) => h.id === heroId);
	if (heroIndex === -1) return {};

	const hero = state.roster[heroIndex];
	const deckIndex = hero.deck.findIndex((c) => c.instanceId === cardInstanceId);
	if (deckIndex === -1) return {};

	const targetCard = hero.deck[deckIndex];

	const evolvedCardId =
		EVOLUTION_RECIPES[targetCard.baseCardId as Card["id"]]?.[runeId];
	if (!evolvedCardId) return {};

	const newDeck = [...hero.deck];
	newDeck[deckIndex] = {
		...targetCard,
		baseCardId: evolvedCardId,
	};

	const newSelectedCards = [...hero.selectedCards];
	const handIndex = newSelectedCards.findIndex(
		(c) => c?.instanceId === cardInstanceId,
	);
	if (handIndex !== -1) {
		newSelectedCards[handIndex] = newDeck[deckIndex];
	}

	const newRoster = [...state.roster];
	newRoster[heroIndex] = {
		...hero,
		deck: newDeck,
		selectedCards: newSelectedCards as Hero["selectedCards"],
	};

	const newInventory = [...state.evolutionRunesInventory];
	const runeIndex = newInventory.indexOf(runeId);
	if (runeIndex !== -1) {
		newInventory.splice(runeIndex, 1);
	}

	return {
		roster: newRoster,
		evolutionRunesInventory: newInventory,
	};
}
