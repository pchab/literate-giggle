import { m } from "motion/react";
import { BattleCard } from "@/modules/cards/components/BattleCard";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { RuneDraftOption } from "@/modules/units/domain/heroClass.types";
import { isCardCompatibleWithRune } from "../runeReward.helpers";

export default function ChooseCard({
	deck,
	selectedRune,
	goBack,
	handleChooseCard,
}: {
	deck: Card[];
	selectedRune: RuneDraftOption;
	goBack: () => void;
	handleChooseCard: (card: Card) => void;
}) {
	return (
		<m.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			className="flex flex-col gap-3 pt-2 h-full"
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

			<div className="flex gap-2 pb-2 scrollbar-thin scrollbar-thumb-zinc-700">
				{deck
					.filter((card) => isCardCompatibleWithRune(card, selectedRune))
					.map((card) => (
						<button
							type="button"
							key={card.id}
							className="w-20 shrink-0 cursor-pointer transform hover:scale-105 hover:-translate-y-1 transition-all"
							onClick={() => handleChooseCard(card)}
						>
							<BattleCard card={card} isPlayable={false} />
						</button>
					))}
			</div>
		</m.div>
	);
}
