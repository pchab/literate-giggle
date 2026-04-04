import type { BattleGet, BattleSet } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import { type Hero, UnitStance } from "@/modules/units/domain/units.type";
import { resolveCard } from "./resolveCard.command";

export const selectCard =
	(get: BattleGet, set: BattleSet) =>
	async (heroId: Hero["id"], card: Card) => {
		const {
			units,
			activeHeroCard: previousCardContext,
			usedCardsThisTurn,
		} = get();
		if (previousCardContext) return;
		if (usedCardsThisTurn[heroId]) {
			console.warn("This hero has already played a card this turn!");
			return;
		}

		const heroIndex = units.findIndex(({ id }) => id === heroId);
		const activeHeroCard = { unitId: heroId, card };

		set(({ units, ...prev }) => ({
			...prev,
			units: units.with(heroIndex, {
				...units[heroIndex],
				stance: UnitStance.ATTACKING,
			}),
			activeHeroCard,
			activeMoveHeroId: null,
		}));

		if (card.playRequirement === "no_target") {
			await resolveCard(get, set)(null, activeHeroCard);

			set((prev) => ({
				...prev,
				activeHeroCard: null,
			}));
		}
	};
