"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { HeroCard } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { RetroButton } from "@/modules/shared/components/RetroButton";
import { useWorldStore } from "@/modules/world/store/world.store";
import { getComputedCard } from "../helpers/cards.helper";
import { BattleCard } from "./BattleCard";

interface HandMenuProps {
	onSaveHand: (heroId: Hero["id"], newCards: Hero["selectedCards"]) => void;
}

export function HandMenu({ onSaveHand }: HandMenuProps) {
	const roster = useWorldStore((state) => state.roster);

	const initialHero = roster[0];
	const [selectedHeroId, setSelectedHeroId] = useState<Hero["id"] | null>(
		initialHero.id,
	);
	const [draftCards, setDraftCards] = useState<Hero["selectedCards"]>(
		initialHero.selectedCards,
	);

	const handleSelectHero = (hero: Hero) => {
		setSelectedHeroId(hero.id);
		setDraftCards([...hero.selectedCards]);
	};

	const handleEquip = (card: HeroCard) => {
		setDraftCards((prev) => {
			const newCards = [...prev];
			if (!newCards[1]) newCards[1] = card;
			else if (!newCards[2]) newCards[2] = card;
			return newCards as Hero["selectedCards"];
		});
	};

	const handleUnequip = (index: number) => {
		if (index === 0) return;
		setDraftCards((prev) => {
			const newCards = [...prev];
			newCards[index] = null;
			if (index === 1 && newCards[2]) {
				newCards[1] = newCards[2];
				newCards[2] = null;
			}
			return newCards as Hero["selectedCards"];
		});
	};

	const handleSave = () => {
		if (!selectedHeroId) return;
		const weapon = draftCards[0];
		const utility1 = draftCards[1] || draftCards[2];
		const utility2 = draftCards[1] && draftCards[2] ? draftCards[2] : null;

		onSaveHand(selectedHeroId, [weapon, utility1, utility2]);
		// Optional: Add a little toast notification here!
	};

	const selectedHero = roster.find((h) => h.id === selectedHeroId);
	if (!selectedHero) return null;

	const weapon = selectedHero.selectedCards[0];
	const availableUtilities = selectedHero.deck.filter(
		(c) => c.instanceId !== weapon.instanceId,
	);
	const isFull = draftCards[1] !== null && draftCards[2] !== null;

	return (
		<div className="absolute inset-0 flex flex-col bg-transparent text-zinc-300">
			{/* Sub-Header: Hero Selection */}
			<div className="flex items-center gap-2 px-8 py-4 bg-zinc-900/50 border-b border-zinc-800">
				<span className="text-zinc-500 font-pixel tracking-widest uppercase mr-4">
					Party Roster:
				</span>
				{roster.map((hero) => (
					<button
						type="button"
						key={hero.id}
						onClick={() => handleSelectHero(hero)}
						className={`px-6 py-2 font-pixel tracking-widest uppercase transition-all ${
							selectedHeroId === hero.id
								? "bg-zinc-800 text-amber-500 border border-zinc-600 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
								: "bg-transparent text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-zinc-700"
						}`}
					>
						{hero.id}
					</button>
				))}
			</div>

			{/* Loadout Columns */}
			<div className="p-8 flex gap-12 overflow-hidden h-full">
				{/* LEFT COLUMN: Equipped */}
				<div className="flex flex-col shrink-0">
					<h3 className="mb-8 font-pixel text-xl tracking-widest text-amber-600 uppercase flex items-center gap-3">
						<span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
						Active Deck (3/3)
					</h3>
					<div className="flex gap-6">
						{/* MAIN WEAPON SLOT */}
						<div className="relative">
							<div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-zinc-900 text-amber-500 px-3 py-1 font-pixel text-xs border border-zinc-700 tracking-widest uppercase whitespace-nowrap shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
								Main Weapon
							</div>
							{draftCards[0] && (
								<BattleCard card={getComputedCard(weapon)} size="large" />
							)}
						</div>

						{/* UTILITY SLOTS */}
						{[1, 2].map((slotIndex) => {
							const card = draftCards[slotIndex];
							return card ? (
								<motion.div
									key={`slot-${slotIndex}`}
									layoutId={card.instanceId}
									className="relative z-20 group"
								>
									<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30 bg-red-950 text-red-400 px-3 py-1 font-pixel text-xs border border-red-900 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
										Unequip
									</div>
									<BattleCard
										card={getComputedCard(card)}
										onClick={() => handleUnequip(slotIndex)}
										size="large"
									/>
								</motion.div>
							) : (
								<div
									key={`slot-${slotIndex}`}
									className="w-card-large h-card-large bg-zinc-900/30 border border-dashed border-zinc-700 flex items-center justify-center pointer-events-none rounded-md"
								>
									<span className="text-zinc-600 font-pixel text-xs uppercase tracking-widest text-center opacity-50">
										Empty
										<br />
										Slot
									</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* RIGHT COLUMN: Available */}
				<div className="flex flex-col grow border-l border-zinc-800/50 pl-12 h-full overflow-hidden">
					<div className="flex justify-between items-center mb-8">
						<h3 className="font-pixel text-xl tracking-widest text-zinc-500 uppercase">
							Available Utilities
						</h3>
						{isFull && (
							<span className="text-red-500 font-pixel text-xs uppercase tracking-widest px-3 py-1 bg-red-950/30 border border-red-900/50 rounded-sm">
								Hand Full
							</span>
						)}
					</div>
					<div className="flex flex-wrap gap-6 pb-8 custom-scrollbar overflow-y-auto content-start">
						{/* ... (Keep your existing mapping logic here) ... */}
						{availableUtilities.map((card) => {
							const isEquipped = draftCards.some(
								(c) => c?.instanceId === card.instanceId,
							);
							if (isEquipped) {
								return (
									<div
										key={`placeholder-${card.instanceId}`}
										className="shrink-0 w-card-large h-card-large bg-zinc-950/30 border border-dashed border-zinc-800/50 rounded-sm"
									/>
								);
							}
							return (
								<motion.div layoutId={card.instanceId} key={card.instanceId}>
									<BattleCard
										card={getComputedCard(card)}
										isPlayable={!isFull}
										onClick={() => !isFull && handleEquip(card)}
										size="large"
									/>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Loadout Footer Actions */}
			<div className="flex justify-end items-center gap-6 px-8 py-6 border-t border-zinc-800 bg-zinc-950/50 mt-auto">
				<RetroButton
					disabled={!draftCards[1] && !draftCards[2]}
					onClick={handleSave}
					variant="warning"
				>
					Commit Roster
				</RetroButton>
			</div>
		</div>
	);
}
