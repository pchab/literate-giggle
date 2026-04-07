"use client";

import { BattleCard } from "@/modules/cards/components/BattleCard";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import { useShallow } from "zustand/shallow";

export default function CardsPage() {
	const { getAllCards } = useRegistryStore(
		useShallow((state) => ({
			getAllCards: state.getAllCards,
		})),
	);
	const allCards = getAllCards();

	return (
		<div className="grid grid-cols-5 mx-auto gap-4 overflow-y-scroll">
			{allCards.map((card) => (
				<BattleCard key={card.id} card={card} size="large" />
			))}
		</div>
	);
}
