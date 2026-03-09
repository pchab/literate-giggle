import type { HeroCard } from "@/modules/cards/domain/cards.type";
import { CLASS_REGISTRY } from "@/modules/figures/data/heroClass.data";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type { RuneDraftOption } from "@/modules/figures/domain/heroClass.types";
import { applyLevelUpTriggers } from "@/modules/figures/helpers/levelUpEffects.helper";
import type { WorldStoreServerAction } from "@/modules/world/store/world.store";

export function claimRewards(
	earnedXp: number,
	completedDraft: Record<
		Hero["id"],
		{
			rune: RuneDraftOption;
			cardInstanceId: HeroCard["instanceId"];
		}[]
	>,
): WorldStoreServerAction {
	return ({ roster, pendingPromotions, unlockedQuestsQueue }) => {
		let newPendingPromotions = [...pendingPromotions];
		let newUnlockedQuestsQueue = [...unlockedQuestsQueue];

		const newRoster = roster.map((hero) => {
			const classDef = CLASS_REGISTRY[hero.heroClass];
			let newHero = { ...hero, currentXp: hero.currentXp + earnedXp };

			// 1. Handle standard Level Ups
			while (
				classDef.xpThresholds[newHero.currentLevel] !== undefined &&
				newHero.currentXp >= classDef.xpThresholds[newHero.currentLevel]
			) {
				const triggersToApply =
					classDef.levelUpTriggers[newHero.currentLevel] || [];

				({
					hero: newHero,
					pendingPromotions: newPendingPromotions,
					unlockedQuestsQueue: newUnlockedQuestsQueue,
				} = triggersToApply.reduce(applyLevelUpTriggers, {
					hero: newHero,
					pendingPromotions: newPendingPromotions,
					unlockedQuestsQueue: newUnlockedQuestsQueue,
				}));

				newHero.currentXp -= classDef.xpThresholds[newHero.currentLevel];
				newHero.currentLevel++;

				// Heal on level up
				if (newHero.currentLevel > hero.currentLevel) {
					newHero.currentHp = newHero.maxHp;
				}
			}

			// 2. Apply the drafted Power Rune (if they made a choice)
			completedDraft[hero.id].forEach((draft) => {
				const { rune, cardInstanceId } = draft;
				const deckIndex = newHero.deck.findIndex(
					(c) => c.instanceId === cardInstanceId,
				);

				if (deckIndex !== -1) {
					const newDeck = [...newHero.deck];
					const targetCard = {
						...newDeck[deckIndex],
						powerRunes: { ...newDeck[deckIndex].powerRunes },
					};

					switch (rune.type) {
						case "bonusDamage":
							targetCard.powerRunes.bonusDamage =
								(targetCard.powerRunes.bonusDamage || 0) + rune.amount;
							break;
						case "bonusHeal":
							targetCard.powerRunes.bonusHeal =
								(targetCard.powerRunes.bonusHeal || 0) + rune.amount;
							break;
						case "bonusRange":
							targetCard.powerRunes.bonusRange =
								(targetCard.powerRunes.bonusRange || 0) + rune.amount;
							break;
						case "bonusStatusAmount":
							targetCard.powerRunes.bonusStatusAmount = {
								...targetCard.powerRunes.bonusStatusAmount,
								[rune.statusType]:
									(targetCard.powerRunes.bonusStatusAmount?.[rune.statusType] ||
										0) + rune.amount,
							};
							break;
						case "bonusStatusDuration":
							targetCard.powerRunes.bonusStatusDuration = {
								...targetCard.powerRunes.bonusStatusDuration,
								[rune.statusType]:
									(targetCard.powerRunes.bonusStatusDuration?.[
										rune.statusType
									] || 0) + rune.amount,
							};
							break;
					}

					newDeck[deckIndex] = targetCard;
					newHero.deck = newDeck;

					const newSelectedCards = [...newHero.selectedCards];
					const handIndex = newSelectedCards.findIndex(
						(c) => c?.instanceId === cardInstanceId,
					);
					if (handIndex !== -1) {
						newSelectedCards[handIndex] = targetCard;
						newHero.selectedCards = newSelectedCards as Hero["selectedCards"];
					}
				}
			});

			return newHero;
		});

		return {
			roster: newRoster,
			pendingPromotions: newPendingPromotions,
			unlockedQuestsQueue: newUnlockedQuestsQueue,
		};
	};
}
