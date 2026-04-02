"use client";

import { domAnimation, LazyMotion, m } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { BattleCard } from "@/modules/cards/components/BattleCard";
import {
	EVOLUTION_RECIPES,
	type EvolutionRuneId,
} from "@/modules/cards/data/evolutionRecipes.data";
import { getComputedCard } from "@/modules/cards/helpers/cards.helper";
import { RetroButton } from "@/modules/shared/components/RetroButton";
import { RetroPanel } from "@/modules/shared/components/RetroPanel";
import { CLASS_REGISTRY } from "@/modules/units/data/heroClass.data";
import type { Hero } from "@/modules/units/domain/units.type";
import { useWorldStore } from "@/modules/world/store/world.store";

export function ForgeScreen({ onClose }: { onClose: () => void }) {
	const { roster, inventory, forgeEvolution } = useWorldStore(
		useShallow((state) => ({
			roster: state.roster,
			inventory: state.evolutionRunesInventory,
			forgeEvolution: state.forgeEvolution,
		})),
	);

	const [selectedRune, setSelectedRune] = useState<EvolutionRuneId | null>(
		null,
	);
	const [selectedHeroId, setSelectedHeroId] = useState<Hero["id"] | null>(
		roster[0]?.id || null,
	);
	const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

	const selectedHero = roster.find((h) => h.id === selectedHeroId);
	const selectedCardInstance = selectedHero?.deck.find(
		(c) => c.instanceId === selectedCardId,
	);

	const evolvedCardBaseId =
		selectedCardInstance && selectedRune
			? EVOLUTION_RECIPES[selectedCardInstance.baseCardId]?.[selectedRune]
			: null;

	const previewCard =
		evolvedCardBaseId && selectedCardInstance
			? getComputedCard({
					...selectedCardInstance,
					baseCardId: evolvedCardBaseId,
				})
			: null;

	const handleForge = () => {
		if (
			!selectedHeroId ||
			!selectedCardId ||
			!selectedRune ||
			!evolvedCardBaseId
		)
			return;

		forgeEvolution(selectedHeroId, selectedCardId, selectedRune);

		setSelectedRune(null);
		setSelectedCardId(null);
	};

	return (
		<LazyMotion features={domAnimation}>
			<div className="w-full h-screen relative overflow-hidden flex flex-col items-center justify-center p-8">
				<div className="absolute inset-0 w-full h-full z-0">
					<Image
						src="/towns/ironhold_forge.webp"
						alt="Ancient Forge of the Deep"
						fill
						className="object-cover opacity-90"
						priority
					/>
					<div className="absolute inset-0 bg-black/40 shadow-inner z-10" />
				</div>

				<div className="w-full max-w-6xl flex flex-col items-center relative z-20">
					<div className="w-full max-w-6xl flex justify-between items-center mb-8">
						<div>
							<h1 className="text-4xl text-amber-500 font-pixel uppercase tracking-widest drop-shadow-md">
								The Rune Forge
							</h1>
							<p className="text-amber-100 font-mono text-xs mt-2 uppercase tracking-wider opacity-90">
								Fuse ancient runes into your gear.
							</p>
						</div>
						<RetroButton onClick={onClose} variant="default">
							LEAVE FORGE
						</RetroButton>
					</div>

					<div className="w-full max-w-6xl flex gap-6 h-[70vh]">
						<div className="w-1/3 flex flex-col gap-6">
							<RetroPanel
								title="Your Runes"
								className="flex-1 bg-stone-900/70 border-stone-700"
							>
								<div className="flex flex-wrap gap-3 pt-4">
									{inventory.length === 0 && (
										<span className="text-zinc-400 text-sm italic">
											No Evolution Runes in inventory.
										</span>
									)}
									{inventory.map((rune, i) => (
										<button
											type="button"
											key={`${rune}-${i}`}
											onClick={() => setSelectedRune(rune)}
											className={`px-4 py-2 border-2 rounded font-bold text-sm uppercase transition-all ${
												selectedRune === rune
													? "border-amber-400 bg-amber-900/60 text-amber-300 scale-105"
													: "border-stone-600 bg-stone-900/70 text-amber-200/80 hover:border-amber-500 hover:bg-stone-800"
											}`}
										>
											{rune.replace("rune_", "")} Rune
										</button>
									))}
								</div>
							</RetroPanel>

							<RetroPanel
								title="Party Members"
								className="flex-1 bg-stone-900/70 border-stone-700"
							>
								<div className="flex flex-col gap-2 pt-4">
									{roster.map((hero) => (
										<button
											type="button"
											key={hero.id}
											onClick={() => {
												setSelectedHeroId(hero.id);
												setSelectedCardId(null);
											}}
											className={`p-3 border text-left rounded transition-all flex justify-between items-center ${
												selectedHeroId === hero.id
													? "border-amber-500 bg-amber-950/40 text-amber-300"
													: "border-stone-700 bg-stone-900/50 text-amber-100/70 hover:border-amber-600"
											}`}
										>
											<span className="font-bold uppercase tracking-wider">
												{hero.name}
											</span>
											<span className="text-xs">
												{CLASS_REGISTRY[hero.heroClass].name}
											</span>
										</button>
									))}
								</div>
							</RetroPanel>
						</div>

						{/* MIDDLE COLUMN: Hero Deck (Translucent & scrollable) */}
						<RetroPanel
							title="Equipment"
							className="w-1/3 bg-stone-900/70 border-stone-700 custom-scrollbar"
						>
							<div className="flex flex-wrap gap-6 pt-4 justify-center">
								{selectedHero?.deck.map((cardInstance) => {
									const isSelected = selectedCardId === cardInstance.instanceId;

									const isValidMatch =
										selectedRune &&
										EVOLUTION_RECIPES[cardInstance.baseCardId]?.[selectedRune];

									return (
										<button
											type="button"
											key={cardInstance.instanceId}
											onClick={() => setSelectedCardId(cardInstance.instanceId)}
											className={`shrink-0 cursor-pointer transition-all transform ${
												isSelected
													? "scale-105 ring-2 ring-amber-400 rounded-xl"
													: "hover:scale-105 hover:-translate-y-1"
											} ${isValidMatch && !isSelected ? "ring-2 ring-amber-500/50 rounded-xl animate-pulse" : ""}`}
										>
											<BattleCard
												card={getComputedCard(cardInstance)}
												isPlayable={false}
											/>
										</button>
									);
								})}
							</div>
						</RetroPanel>

						{/* RIGHT COLUMN: The Anvil (Conceptually inside the fireplace!) */}
						<RetroPanel
							title="The Arcane Hearth"
							className="w-1/3 bg-stone-900/70 border-stone-700 flex flex-col items-center relative"
						>
							<div className="flex-1 flex flex-col items-center justify-center w-full pt-4">
								{!selectedRune || !selectedCardId ? (
									<span className="text-amber-200/80 text-sm text-center px-8 uppercase tracking-widest leading-loose">
										NO RUNE SEEN... NO EQUIPMENT GIVEN... HEARTH SILENT.
									</span>
								) : !evolvedCardBaseId ? (
									<div className="text-center text-red-500/90 uppercase font-bold tracking-widest">
										<span className="text-4xl block mb-2">❌</span>
										FORGE SPITS: MISTAKE
									</div>
								) : (
									<m.div
										initial={{ opacity: 0, scale: 0.8, y: 20 }}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										className="flex flex-col items-center gap-6 w-full"
									>
										<span className="text-amber-300 font-bold uppercase tracking-widest text-sm animate-pulse">
											THE HEARTH GLOWS
										</span>

										<div className="w-40 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">
											{previewCard && (
												<BattleCard card={previewCard} isPlayable={false} />
											)}
										</div>

										<RetroButton
											onClick={handleForge}
											variant="primary"
											className="w-3/4 mt-4 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
										>
											FORGE EVOLUTION
										</RetroButton>
									</m.div>
								)}
							</div>
						</RetroPanel>
					</div>
				</div>
			</div>
		</LazyMotion>
	);
}
