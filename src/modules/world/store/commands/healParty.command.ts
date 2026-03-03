import type { WorldStoreServerAction } from "@/modules/world/store/world.store";

export function healParty(healAmount: number): WorldStoreServerAction {
	return ({ roster }) => {
		return {
			roster: roster.map((hero) => {
				return {
					...hero,
					currentHp: Math.min(hero.currentHp + healAmount, hero.maxHp),
				};
			}),
		};
	};
}
