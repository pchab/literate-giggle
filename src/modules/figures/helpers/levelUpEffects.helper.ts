import type { Quest } from "@/modules/campaign/domain/quests.type";
import { cardLibrary } from "@/modules/cards/data/cards.data";
import { createHeroCard } from "@/modules/cards/helpers/cards.helper";
import type { Hero } from "../domain/figures.type";
import type {
	LevelUpDefinition,
	PendingPromotion,
} from "../domain/heroClass.types";

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
		selectedCards: [...hero.selectedCards],
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
			const deckIndex = newHero.deck.findIndex(
				(card) => card.baseCardId === trigger.oldCardId,
			);
			const handIndex = newHero.selectedCards.findIndex(
				(card) => card?.baseCardId === trigger.oldCardId,
			);
			if (deckIndex !== -1 && cardLibrary[trigger.newCardId]) {
				newHero.deck[deckIndex].baseCardId = trigger.newCardId;
			}
			if (
				handIndex !== -1 &&
				newHero.selectedCards[handIndex] &&
				cardLibrary[trigger.newCardId]
			) {
				newHero.selectedCards[handIndex].baseCardId = trigger.newCardId;
			}
			break;
		}

		case "cardUnlock":
			trigger.newCards.forEach((cardId) => {
				if (cardLibrary[cardId]) {
					newHero.deck.push(createHeroCard(hero.id)(cardId));
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
