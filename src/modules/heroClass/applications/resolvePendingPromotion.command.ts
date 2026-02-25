import type { WorldStoreServerAction } from "@/store/world.store";

export function resolvePendingPromotion(): WorldStoreServerAction {
	return ({ pendingPromotion, roster }) => {
		if (!pendingPromotion) return {};

		const hero = roster.find((hero) => hero.id === pendingPromotion.heroId);
		if (!hero) return {};

		const heroIndex = roster.findIndex(
			(hero) => hero.id === pendingPromotion.heroId,
		);

		return {
			roster: roster.with(heroIndex, {
				...hero,
				heroClass: pendingPromotion.newClass,
			}),
			pendingPromotion: null,
		};
	};
}
