import type { BattleStoreServerAction } from "@/store/battle.store";
import type { Hero } from "../domain/figures.type";

export function selectActiveMoveHero(
	heroId: Hero["id"] | null,
): BattleStoreServerAction {
	return () => ({
		activeMoveHeroId: heroId,
		activeCard: null,
	});
}
