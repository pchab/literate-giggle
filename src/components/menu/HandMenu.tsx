import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { RetroButton } from "@/components/ui/RetroButton";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useWorldStore } from "@/store/world.store";
import { LoadoutCard } from "../cards/LoadoutCard";

interface HandMenuProps {
	onSaveLoadout: (
		heroId: Hero["id"],
		newCards: [Card["id"], Card["id"], Card["id"] | null],
	) => void;
}

export function HandMenu({ onSaveLoadout }: HandMenuProps) {
	const roster = useWorldStore((state) => state.roster);

	const [selectedHeroId, setSelectedHeroId] = useState<Hero["id"] | null>(null);
	const [draftCards, setDraftCards] = useState<(Card["id"] | null)[]>([
		null,
		null,
		null,
	]);

	// Initialize with the first hero when the component mounts
	useEffect(() => {
		if (roster.length > 0 && !selectedHeroId) {
			const initialHero = roster[0];
			setSelectedHeroId(initialHero.id);
			setDraftCards([...initialHero.hand]);
		}
	}, [roster, selectedHeroId]);

	const handleSelectHero = (hero: Hero) => {
		setSelectedHeroId(hero.id);
		setDraftCards([...hero.hand]);
	};

	const handleEquip = (cardId: Card["id"]) => {
		setDraftCards((prev) => {
			const newCards = [...prev];
			if (!newCards[1]) newCards[1] = cardId;
			else if (!newCards[2]) newCards[2] = cardId;
			return newCards;
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
			return newCards;
		});
	};

	const handleSave = () => {
		if (!selectedHeroId) return;
		const weapon = draftCards[0] as Card["id"];
		const utility1 = (draftCards[1] || draftCards[2]) as Card["id"];
		const utility2 = draftCards[1] && draftCards[2] ? draftCards[2] : null;

		onSaveLoadout(selectedHeroId, [weapon, utility1, utility2]);
		// Optional: Add a little toast notification here!
	};

	const selectedHero = roster.find((h) => h.id === selectedHeroId);
	if (!selectedHero) return null;

	const weaponId = selectedHero.hand[0];
	const availableUtilities = selectedHero.deck.filter(
		(cId) => cId !== weaponId,
	);
	const isFull = draftCards[1] !== null && draftCards[2] !== null;

	return (
		<div className="absolute inset-0 flex flex-col bg-slate-900">
			{/* Sub-Header: Hero Selection */}
			<div className="flex items-center gap-2 px-8 py-4 bg-slate-800 border-b-4 border-slate-700">
				<span className="text-slate-400 font-pixel tracking-widest uppercase mr-4">
					Select Hero:
				</span>
				{roster.map((hero) => (
					<button
						type="button"
						key={hero.id}
						onClick={() => handleSelectHero(hero)}
						className={`px-4 py-2 font-pixel tracking-widest uppercase transition-colors text-shadow-pixel ${
							selectedHeroId === hero.id
								? "bg-slate-700 text-yellow-500 shadow-[inset_0_2px_0_rgba(255,255,255,0.2)]"
								: "bg-slate-900 text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-700"
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
					<h3 className="mb-6 font-pixel text-xl tracking-widest text-slate-300 uppercase flex items-center gap-2">
						<span className="w-3 h-3 bg-green-500 border-2 border-black animate-pulse" />
						Active Deck (3/3)
					</h3>
					<div className="flex gap-6">
						<div className="relative">
							<div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-30 bg-yellow-600 text-white px-2 py-1 font-pixel text-sm shadow-[inset_0_0_0_2px_rgba(255,255,255,0.4),2px_2px_0px_0px_rgba(0,0,0,0.8)] border-2 border-black tracking-widest uppercase whitespace-nowrap">
								Main Weapon
							</div>
							{draftCards[0] && (
								<LoadoutCard cardId={draftCards[0]} variant="weapon" />
							)}
						</div>
						{[1, 2].map((slotIndex) => {
							const cardId = draftCards[slotIndex];
							return cardId ? (
								<motion.div
									key={`slot-${slotIndex}`}
									layoutId={cardId}
									className="relative z-20 group"
								>
									<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30 bg-red-600 text-white px-2 py-1 font-pixel text-xs border-2 border-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
										Unequip
									</div>
									<LoadoutCard
										cardId={cardId}
										variant="utility"
										onClick={() => handleUnequip(slotIndex)}
									/>
								</motion.div>
							) : (
								<div
									key={`slot-${slotIndex}`}
									className="w-card-large h-card-large bg-slate-950 border-4 border-dashed border-slate-800 flex items-center justify-center pointer-events-none"
								>
									<span className="text-slate-700 font-pixel text-sm uppercase tracking-widest text-center">
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
				<div className="flex flex-col grow border-l-4 border-slate-800 pl-12 h-full overflow-hidden">
					<div className="flex justify-between items-center mb-6">
						<h3 className="font-pixel text-xl tracking-widest text-slate-400 uppercase">
							Available Utilities
						</h3>
						{isFull && (
							<span className="text-red-400 font-pixel text-sm uppercase tracking-widest px-2 py-1 bg-red-950 border-2 border-red-900">
								Hand Full
							</span>
						)}
					</div>
					<div className="flex flex-wrap gap-6 pb-8 custom-scrollbar overflow-y-auto content-start">
						{availableUtilities.map((cardId) => {
							const isEquipped = draftCards.some((cId) => cId === cardId);
							if (isEquipped) {
								return (
									<div
										key={`placeholder-${cardId}`}
										className="shrink-0 w-card-large h-card-large bg-slate-900/30 border-4 border-dashed border-slate-800"
									/>
								);
							}
							return (
								<motion.div layoutId={cardId} key={cardId}>
									<LoadoutCard
										cardId={cardId}
										variant="utility"
										isDisabled={isFull}
										onClick={() => !isFull && handleEquip(cardId)}
									/>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Loadout Footer Actions */}
			<div className="flex justify-end items-center gap-6 px-8 py-4 border-t-4 border-slate-700 bg-slate-800 mt-auto">
				<RetroButton
					disabled={!draftCards[1] && !draftCards[2]}
					onClick={handleSave}
					variant="warning"
				>
					Save Hand
				</RetroButton>
			</div>
		</div>
	);
}
