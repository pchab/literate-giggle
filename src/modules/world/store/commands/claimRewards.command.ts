import type { HeroCard } from "@/modules/cards/domain/cards.type";
import { addPowerRune } from "@/modules/cards/helpers/heroCards.helper";
import { CLASS_REGISTRY } from "@/modules/units/data/heroClass.data";
import type { RuneDraftOption } from "@/modules/units/domain/heroClass.types";
import type { Hero } from "@/modules/units/domain/units.type";
import { applyLevelUpTriggers } from "@/modules/units/helpers/levelUpEffects.helper";
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
					const targetCard = addPowerRune(rune, {
						...newDeck[deckIndex],
						powerRunes: { ...newDeck[deckIndex].powerRunes },
					});

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
