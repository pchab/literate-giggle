import { m } from "motion/react";
import { HeroCardView } from "@/modules/cards/components/HeroCardView";
import type { Card } from "@/modules/cards/domain/cards.type";
import { getComputedCard } from "@/modules/cards/helpers/cards.helper";
import type { RuneDraftOption } from "@/modules/units/domain/heroClass.types";
import type { Hero } from "@/modules/units/domain/units.type";
import { isCardCompatibleWithRune } from "../runeReward.helpers";

/** Second half of a rune pick: which card gets it. Shows each card with the rune applied. */
export default function ChooseCard({
	hero,
	selectedRune,
	goBack,
	handleChooseCard,
}: {
	hero: Hero;
	selectedRune: RuneDraftOption;
	goBack: () => void;
	handleChooseCard: (cardInstanceId: Card["id"]) => void;
}) {
	const handIds = new Set(hero.selectedCards.map((c) => c?.instanceId));
	const targets = hero.deck.filter((c) =>
		isCardCompatibleWithRune(getComputedCard(c), selectedRune),
	);

	return (
		<m.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="flex flex-col gap-3"
		>
			<div className="flex justify-between items-center">
				<span className="text-xs font-bold text-cyan-400 uppercase">
					Apply {selectedRune.label} to:
				</span>
				<button
					type="button"
					onClick={goBack}
					className="text-[10px] text-slate-500 hover:text-slate-300 uppercase underline"
				>
					Back
				</button>
			</div>
			<span className="text-[10px] text-zinc-500">
				Hover a card to see its stats after the upgrade.
			</span>

			<div className="flex gap-3 pt-3 pb-2 flex-wrap justify-center">
				{targets.map((heroCard) => (
					<HeroCardView
						key={heroCard.instanceId}
						heroCard={heroCard}
						previewRune={selectedRune}
						inHand={handIds.has(heroCard.instanceId)}
						onClick={() => handleChooseCard(heroCard.instanceId)}
					/>
				))}
			</div>
		</m.div>
	);
}
