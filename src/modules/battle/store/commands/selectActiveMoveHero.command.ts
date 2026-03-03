import type { BattleStoreServerAction } from "@/modules/battle/store/battle.store";
import type { Hero } from "../../../figures/domain/figures.type";

export function selectActiveMoveHero(
	heroId: Hero["id"] | null,
): BattleStoreServerAction {
	return () => ({
		activeMoveHeroId: heroId,
		activeCard: null,
	});
}
