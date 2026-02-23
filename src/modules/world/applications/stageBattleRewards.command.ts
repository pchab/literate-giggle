import type { CardLog } from "@/modules/cards/domain/cards.type";
import type { WorldStoreServerAction } from "@/store/world.store";

export function stageBattleRewards(
	remainingHp: Record<string, number>,
	cardLog: CardLog,
): WorldStoreServerAction {
	return ({ roster }) => ({
		roster: roster.map((hero) => ({
			...hero,
			currentHp:
				remainingHp[hero.id] !== undefined
					? remainingHp[hero.id]
					: hero.currentHp,
		})),
		pendingBattleLog: cardLog,
		phase: "REWARD",
	});
}
