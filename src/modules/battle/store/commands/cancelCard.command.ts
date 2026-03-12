import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import { UnitStance } from "@/modules/figures/domain/figures.type";

export function cancelCard(): BattleStoreServerAction {
	return ({ heroes, activeHeroCard }) => {
		if (!activeHeroCard) {
			console.warn("No card is currently selected.");
			return {};
		}

		const { unitId: heroId } = activeHeroCard;
		const heroIndex = heroes.findIndex(({ id }) => id === heroId);

		return {
			heroes: heroes.with(heroIndex, {
				...heroes[heroIndex],
				stance: UnitStance.IDLE,
			}),
			activeHeroCard: null,
		};
	};
}
