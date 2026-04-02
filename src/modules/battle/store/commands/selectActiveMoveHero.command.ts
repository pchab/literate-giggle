import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import type { Hero } from "@/modules/units/domain/units.type";

export function selectActiveMoveHero(
	heroId: Hero["id"] | null,
): BattleStoreServerAction {
	return () => ({
		activeMoveHeroId: heroId,
		activeHeroCard: null,
	});
}
