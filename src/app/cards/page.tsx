import { BattleCard } from "@/modules/cards/components/BattleCard";
import { cardLibrary } from "@/modules/cards/data/cards.data";

export default function CardsPage() {
	const allCards = Object.values(cardLibrary);

	return (
		<div className="grid grid-cols-5 mx-auto gap-4 overflow-y-scroll">
			{allCards.map((card) => (
				<BattleCard card={card} size="large" />
			))}
		</div>
	);
}
