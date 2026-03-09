import type { Hero } from "@/modules/figures/domain/figures.type";
import type { WorldStoreServerAction } from "@/modules/world/store/world.store";

export function updateSelectedCards(
	heroId: Hero["id"],
	selectedCards: Hero["selectedCards"],
): WorldStoreServerAction {
	return ({ roster }) => {
		return {
			roster: roster.map((hero) => {
				if (hero.id === heroId) {
					return {
						...hero,
						selectedCards,
					};
				}
				return hero;
			}),
		};
	};
}
