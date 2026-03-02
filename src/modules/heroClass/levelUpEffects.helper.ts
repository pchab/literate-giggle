import { cardLibrary } from "../cards/domain/cards.data";
import type { Hero } from "../figures/domain/figures.type";
import type { Quest } from "../quests/domain/quests.type";
import type {
	LevelUpDefinition,
	PendingPromotion,
} from "./domain/heroClass.types";

export function applyLevelUpTriggers(
	{
		hero,
		pendingPromotions,
		unlockedQuestsQueue,
	}: {
		hero: Hero;
		pendingPromotions: PendingPromotion[];
		unlockedQuestsQueue: Quest["id"][];
	},
	trigger: LevelUpDefinition,
) {
	const newHero: Hero = {
		...hero,
		deck: [...hero.deck],
		hand: [...hero.hand],
		passives: [...hero.passives],
	};
	const newPendingPromotions = [...pendingPromotions];
	const newUnlockedQuests = [...unlockedQuestsQueue];

	switch (trigger.type) {
		case "statsIncrease":
			if (trigger.stat === "hp") newHero.maxHp += trigger.amount;
			if (trigger.stat === "def") newHero.baseDef += trigger.amount;
			if (trigger.stat === "move") newHero.baseMove += trigger.amount;
			break;

		case "cardUpgrade": {
			const deckIndex = newHero.deck.indexOf(trigger.oldCardId);
			const handIndex = newHero.hand.indexOf(trigger.oldCardId); // Fixed cardsIndex to handIndex
			if (deckIndex !== -1 && cardLibrary[trigger.newCardId]) {
				newHero.deck[deckIndex] = trigger.newCardId;
			}
			if (handIndex !== -1 && cardLibrary[trigger.newCardId]) {
				newHero.hand[handIndex] = trigger.newCardId;
			}
			break;
		}

		case "cardUnlock":
			trigger.newCards.forEach((cardId) => {
				if (cardLibrary[cardId]) {
					newHero.deck.push(cardId);
				}
			});
			break;

		case "passiveUnlock":
			if (!newHero.passives.includes(trigger.passiveId)) {
				newHero.passives.push(trigger.passiveId);
			}
			break;

		case "classPromotion":
			newPendingPromotions.push({
				heroId: hero.id,
				classChoices: trigger.classId,
			});
			break;

		case "unlockQuest":
			newUnlockedQuests.push(trigger.questId);
			break;
	}

	return {
		hero: newHero,
		pendingPromotions: newPendingPromotions,
		unlockedQuestsQueue: newUnlockedQuests,
	};
}
