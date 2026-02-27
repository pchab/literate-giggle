import type { Hero } from "@/modules/figures/domain/figures.type";
import type { WorldState } from "@/store/world.store";
import type { Hand } from "../domain/cards.type";

export function updateHand(heroId: Hero["id"], cards: Hand) {
	return (state: WorldState) => {
		return {
			roster: state.roster.map((hero) => {
				if (hero.id === heroId) {
					return {
						...hero,
						cards,
					};
				}
				return hero;
			}),
		};
	};
}
