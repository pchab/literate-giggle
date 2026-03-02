import type { WorldStoreServerAction } from "@/store/world.store";

export function stageBattleRewards(
	remainingHp: Record<string, number>,
): WorldStoreServerAction {
	return ({ roster }) => ({
		roster: roster.map((hero) => ({
			...hero,
			currentHp:
				remainingHp[hero.id] !== undefined
					? remainingHp[hero.id]
					: hero.currentHp,
		})),
		phase: "REWARD",
		currentVfx: {},
	});
}
