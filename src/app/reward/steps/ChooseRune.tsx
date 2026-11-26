import { m } from "motion/react";
import { HeroCardView } from "@/modules/cards/components/HeroCardView";
import { getComputedCard } from "@/modules/cards/helpers/cards.helper";
import type { RuneDraftOption } from "@/modules/units/domain/heroClass.types";
import type { Hero } from "@/modules/units/domain/units.type";
import { isCardCompatibleWithRune } from "../runeReward.helpers";

export default function ChooseRune({
	hero,
	choices,
	handleChooseRune,
}: {
	hero: Hero;
	choices: RuneDraftOption[];
	handleChooseRune: (rune: RuneDraftOption) => void;
}) {
	const handIds = new Set(hero.selectedCards.map((c) => c?.instanceId));
	const computedDeck = hero.deck.map(getComputedCard);

	return (
		<m.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="flex flex-col gap-3"
		>
			<div className="flex flex-col gap-1 bg-zinc-900/50 p-2 rounded border border-zinc-800">
				<span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
					{hero.name}'s cards
				</span>
				<div className="flex gap-2 pt-2 pb-1 flex-wrap justify-center">
					{hero.deck.map((heroCard) => (
						<HeroCardView
							key={heroCard.instanceId}
							heroCard={heroCard}
							inHand={handIds.has(heroCard.instanceId)}
						/>
					))}
				</div>
			</div>

			<span className="text-xs font-bold text-yellow-400 uppercase">
				Pick an upgrade
			</span>

			<div className="flex flex-col gap-2">
				{choices.map((rune) => {
					const targets = hero.deck.filter((_, i) =>
						isCardCompatibleWithRune(computedDeck[i], rune),
					);
					const hasValidTarget = targets.length > 0;
					const targetNames = targets
						.map((t) => computedDeck[hero.deck.indexOf(t)].name)
						.join(", ");

					return (
						<button
							type="button"
							key={rune.label}
							disabled={!hasValidTarget}
							onClick={() => handleChooseRune(rune)}
							className={`border rounded p-2 text-sm text-left transition-colors flex justify-between items-center gap-2 ${
								hasValidTarget
									? "bg-zinc-800 hover:bg-zinc-700 border-zinc-600 cursor-pointer"
									: "bg-zinc-900 border-zinc-800 opacity-50 cursor-not-allowed"
							}`}
						>
							<span className="flex flex-col">
								<span
									className={
										hasValidTarget
											? "text-slate-200"
											: "text-slate-500 line-through"
									}
								>
									{rune.label}
								</span>
								<span className="text-[10px] text-zinc-500">
									{hasValidTarget
										? `Fits: ${targetNames}`
										: "No compatible card"}
								</span>
							</span>
							<span
								className={`font-mono text-xs ${hasValidTarget ? "text-emerald-400" : "text-slate-600"}`}
							>
								+{rune.amount}
							</span>
						</button>
					);
				})}
			</div>
		</m.div>
	);
}
