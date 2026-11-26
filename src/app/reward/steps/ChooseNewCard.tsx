import { m } from "motion/react";
import { HeroCardView } from "@/modules/cards/components/HeroCardView";
import type { Card, HeroCard } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/units/domain/units.type";

export default function ChooseNewCard({
	hero,
	options,
	handleChoose,
}: {
	hero: Hero;
	options: Card["id"][];
	handleChoose: (cardId: Card["id"]) => void;
}) {
	const available = options.filter(
		(id) => !hero.deck.some((c) => c.baseCardId === id),
	);
	const handHasRoom = hero.selectedCards.some((c, i) => i > 0 && !c);

	return (
		<m.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="flex flex-col gap-3"
		>
			<span className="text-xs font-bold text-yellow-400 uppercase">
				Learn a new skill
			</span>
			<span className="text-[10px] text-zinc-500">
				{handHasRoom
					? "It will be equipped in the free hand slot."
					: "It goes to the deck. Swap it into the hand from the menu."}{" "}
				Hover for details.
			</span>
			<div className="flex gap-3 pt-3 pb-2 flex-wrap justify-center">
				{available.map((cardId) => {
					const preview: HeroCard = {
						instanceId: cardId,
						baseCardId: cardId,
						powerRunes: {},
					};
					return (
						<HeroCardView
							key={cardId}
							heroCard={preview}
							onClick={() => handleChoose(cardId)}
						/>
					);
				})}
			</div>
		</m.div>
	);
}
