import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import { UnitStance } from "@/modules/units/domain/units.type";

export function cancelCard(): BattleStoreServerAction {
	return ({ units, activeHeroCard }) => {
		if (!activeHeroCard) {
			console.warn("No card is currently selected.");
			return {};
		}

		const { unitId: heroId } = activeHeroCard;
		const heroIndex = units.findIndex(({ id }) => id === heroId);

		return {
			units: units.with(heroIndex, {
				...units[heroIndex],
				stance: UnitStance.IDLE,
			}),
			activeHeroCard: null,
		};
	};
}
