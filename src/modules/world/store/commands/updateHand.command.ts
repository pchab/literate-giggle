import type { Hero } from "@/modules/figures/domain/figures.type";
import type { WorldStoreServerAction } from "@/modules/world/store/world.store";
import type { Hand } from "../../../cards/domain/cards.type";

export function updateHand(
	heroId: Hero["id"],
	hand: Hand,
): WorldStoreServerAction {
	return ({ roster }) => {
		return {
			roster: roster.map((hero) => {
				if (hero.id === heroId) {
					return {
						...hero,
						hand,
					};
				}
				return hero;
			}),
		};
	};
}
