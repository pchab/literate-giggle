import type { WorldStoreServerAction } from "@/modules/world/store/world.store";

/**
 * The cost of losing without a retry: every hero keeps half of the HP
 * they had before the fight (at least 1). Rest at an inn to recover.
 */
export const BATTERED_HP_RATIO = 0.5;

export function batterParty(): WorldStoreServerAction {
	return ({ roster }) => ({
		roster: roster.map((hero) => ({
			...hero,
			currentHp: Math.max(1, Math.floor(hero.currentHp * BATTERED_HP_RATIO)),
		})),
	});
}
