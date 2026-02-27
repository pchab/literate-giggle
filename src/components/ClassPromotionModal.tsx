"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { BattleCard } from "@/components/cards/BattleCard";
import { cardLibrary } from "@/modules/cards/domain/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";
import { CLASS_REGISTRY } from "@/modules/heroClass/domain/heroClass.data";
import { useWorldStore } from "@/store/world.store";
import { HeroPortrait } from "./HeroPortrait";

export function ClassPromotionModal() {
	const { pendingPromotion, resolvePromotion, roster } = useWorldStore(
		useShallow((state) => ({
			pendingPromotion: state.pendingPromotion,
			resolvePromotion: state.resolvePromotion,
			roster: state.roster,
		})),
	);

	const [selectedCardId, setSelectedCardId] = useState<Card["id"] | null>(null);

	if (!pendingPromotion) return null;

	const hero = roster.find((h) => h.id === pendingPromotion.heroId);
	const classDef = CLASS_REGISTRY[pendingPromotion.newClass];

	if (!hero || !classDef) return null;

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-md"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				{/* Epic God-Rays Background */}
				<motion.div
					className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none"
					animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
					transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
				/>

				<motion.h2
					className="text-4xl font-black text-amber-400 tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] mb-12"
					initial={{ y: -50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, type: "spring" }}
				>
					Class Promotion
				</motion.h2>

				<div className="flex items-center gap-12 z-10">
					{/* Old Class */}
					<motion.div className="flex flex-col items-center opacity-50 grayscale">
						<HeroPortrait classType={pendingPromotion.oldClass} />
						<span className="mt-4 text-zinc-500 font-bold tracking-widest uppercase">
							{pendingPromotion.oldClass}
						</span>
					</motion.div>

					{/* The Arrow / Energy Transfer */}
					<motion.div
						className="text-4xl text-amber-500"
						initial={{ scale: 0 }}
						animate={{ scale: 1, x: [-10, 10, -10] }}
						transition={{
							scale: { delay: 0.5 },
							x: { repeat: Infinity, duration: 1.5 },
						}}
					>
						➾
					</motion.div>

					{/* New Class (Explodes in) */}
					<motion.div
						className="flex flex-col items-center relative"
						initial={{ scale: 0, rotate: -15 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{ delay: 0.8, type: "spring", bounce: 0.6 }}
					>
						{/* Flash effect */}
						<motion.div
							className="absolute inset-0 bg-white rounded-full z-20 pointer-events-none"
							initial={{ opacity: 1, scale: 1 }}
							animate={{ opacity: 0, scale: 2 }}
							transition={{ delay: 0.8, duration: 0.5 }}
						/>
						<div className="ring-4 ring-amber-400 rounded-full shadow-[0_0_40px_rgba(251,191,36,0.6)] scale-125">
							<HeroPortrait classType={pendingPromotion.newClass} />
						</div>
						<span className="mt-8 text-amber-400 font-black text-xl tracking-widest uppercase drop-shadow-md">
							{pendingPromotion.newClass}
						</span>
					</motion.div>
				</div>

				{/* --- THE NEW UTILITY CARD CHOICE UI --- */}
				<motion.div
					className="flex flex-col items-center z-10"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.2 }}
				>
					<h3 className="text-zinc-300 uppercase tracking-widest mb-6 font-bold">
						Choose your Class Art
					</h3>
					<div className="flex gap-8">
						{classDef.utilityCardChoices.map((cardId) => {
							const cardDef = cardLibrary[cardId];
							const isSelected = selectedCardId === cardId;

							return (
								<button
									type="button"
									key={cardId}
									onClick={() => setSelectedCardId(cardId)}
									className={`relative transition-all duration-300 ${
										isSelected
											? "scale-110 shadow-[0_0_30px_rgba(251,191,36,0.4)]"
											: "scale-100 hover:scale-105 opacity-70 hover:opacity-100 grayscale hover:grayscale-0"
									}`}
								>
									<BattleCard {...cardDef} />

									{isSelected && (
										<motion.div
											layoutId="card-selection-ring"
											className="absolute -inset-2 border-2 border-amber-400 rounded-xl pointer-events-none"
										/>
									)}
								</button>
							);
						})}
					</div>
				</motion.div>

				<motion.button
					disabled={!selectedCardId}
					className={`mt-12 px-8 py-3 font-bold tracking-widest uppercase rounded shadow-lg transition-all z-10 ${
						selectedCardId
							? "bg-amber-600 hover:bg-amber-500 text-zinc-950 cursor-pointer"
							: "bg-zinc-800 text-zinc-600 cursor-not-allowed"
					}`}
					onClick={() => selectedCardId && resolvePromotion(selectedCardId)}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.5 }}
				>
					Accept Destiny
				</motion.button>
			</motion.div>
		</AnimatePresence>
	);
}
