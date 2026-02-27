import { m } from "motion/react";
import { RetroPanel } from "@/components/ui/RetroPanel";
import { formatCardEffect } from "@/modules/cards/cards.helper";
import { cardLibrary } from "@/modules/cards/domain/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";

export default function EvolutionModal({
	handleEvolveChoice,
	evolutionModal,
	setEvolutionModal,
}: {
	handleEvolveChoice: (
		heroId: Hero["id"],
		oldCardId: Card["id"],
		newCardId: Card["id"],
	) => void;
	evolutionModal: { heroId: Hero["id"]; cardId: Card["id"] };
	setEvolutionModal: (
		evolutionModal: { heroId: Hero["id"]; cardId: Card["id"] } | null,
	) => void;
}) {
	return (
		<m.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4"
		>
			<m.div
				initial={{ scale: 0.9, y: 20 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.9, y: 20 }}
				className="max-w-2xl w-full"
			>
				<RetroPanel title="Choose Evolution">
					<button
						type="button"
						onClick={() => setEvolutionModal(null)}
						className="absolute -top-4 -right-4 bg-zinc-800 border-2 border-zinc-600 font-pixel w-10 h-10 flex items-center justify-center text-zinc-300 hover:bg-zinc-700 hover:text-white text-xl z-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all"
					>
						X
					</button>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{cardLibrary[evolutionModal.cardId]?.evolutions.map((evoId) => {
							const evoData = cardLibrary[evoId];
							if (!evoData) return null;

							return (
								<button
									type="button"
									key={evoId}
									onClick={() =>
										handleEvolveChoice(
											evolutionModal.heroId,
											evolutionModal.cardId,
											evoId,
										)
									}
									className="group cursor-pointer bg-slate-800 border border-slate-600 rounded-lg p-6 hover:border-yellow-400 hover:bg-slate-700 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(250,204,21,0.2)] flex flex-col gap-3 text-left relative overflow-hidden"
								>
									{/* Visual indicator for Class Promotions */}
									{evoData.promotesToClass && (
										<div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black uppercase px-2 py-1 rounded-bl-lg">
											Class Promotion!
										</div>
									)}

									<div className="flex justify-between items-start mt-2">
										<h3 className="text-2xl font-pixel text-white group-hover:text-yellow-400 transition-colors text-shadow-pixel">
											{evoData.name}
										</h3>
									</div>

									{/* Visual indicator for Passives */}
									{evoData.grantsPassive && (
										<div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
											<span>✨ Unlocks Passive:</span>
											<span className="uppercase">
												{evoData.grantsPassive.replace("passive-", "")}
											</span>
										</div>
									)}

									{evoData.effects.map((effect, index) => (
										<div
											key={index}
											className="flex gap-2 text-xs font-mono text-cyan-400 pt-3 border-t border-slate-700"
										>
											{formatCardEffect(effect)}
										</div>
									))}
								</button>
							);
						})}
					</div>
				</RetroPanel>
			</m.div>
		</m.div>
	);
}
