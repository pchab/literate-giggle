import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useWorldStore } from "@/store/world.store";
import { LoadoutCard } from "./cards/LoadoutCard";

interface LoadoutModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSaveLoadout: (
		heroId: Hero["id"],
		newCards: [Card, Card, Card | null],
	) => void;
}

export function LoadoutModal({
	isOpen,
	onClose,
	onSaveLoadout,
}: LoadoutModalProps) {
	const roster = useWorldStore((state) => state.roster);

	const [selectedHeroId, setSelectedHeroId] = useState<Hero["id"] | null>(null);
	const [draftCards, setDraftCards] = useState<(Card | null)[]>([
		null,
		null,
		null,
	]);

	useEffect(() => {
		if (isOpen && roster.length > 0) {
			const initialHero = roster[0];
			setSelectedHeroId(initialHero.id);
			setDraftCards([...initialHero.cards]);
		}
	}, [isOpen, roster]);

	const handleSelectHero = (hero: Hero) => {
		setSelectedHeroId(hero.id);
		setDraftCards([...hero.cards]);
	};

	const handleEquip = (card: Card) => {
		setDraftCards((prev) => {
			const newCards = [...prev];
			if (!newCards[1]) newCards[1] = card;
			else if (!newCards[2]) newCards[2] = card;
			return newCards;
		});
	};

	const handleUnequip = (index: number) => {
		if (index === 0) return; // Cannot unequip weapon

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

		const weapon = draftCards[0] as Card;
		const utility1 = (draftCards[1] || draftCards[2]) as Card;
		const utility2 = draftCards[1] && draftCards[2] ? draftCards[2] : null;

		onSaveLoadout(selectedHeroId, [weapon, utility1, utility2]);
		onClose();
	};

	if (!isOpen) return null;

	const selectedHero = roster.find((h) => h.id === selectedHeroId);
	if (!selectedHero) return null;

	const weaponId = selectedHero.cards[0]?.id;
	const availableUtilities = selectedHero.deck.filter((c) => c.id !== weaponId);
	const isFull = draftCards[1] !== null && draftCards[2] !== null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md font-sans"
			>
				<motion.div
					initial={{ scale: 0.95, y: 20 }}
					animate={{ scale: 1, y: 0 }}
					exit={{ scale: 0.95, y: 20 }}
					className="flex flex-col w-full overflow-hidden border bg-zinc-950 border-zinc-800 rounded-2xl text-zinc-100 shadow-2xl m-auto"
				>
					{/* Header & Hero Selection */}
					<div className="flex items-end justify-between px-8 pt-8 pb-4 border-b border-zinc-800 bg-zinc-900/50">
						<div>
							<h2 className="text-3xl font-black tracking-widest text-yellow-500 uppercase drop-shadow-md">
								Camp Loadout
							</h2>
							<p className="text-sm text-zinc-400 mt-1">
								Prepare your squad's deck for the next battle.
							</p>
						</div>
						<div className="flex gap-2">
							{roster.map((hero) => (
								<button
									type="button"
									key={hero.id}
									onClick={() => handleSelectHero(hero)}
									className={`px-6 py-3 rounded-t-lg font-bold tracking-widest uppercase transition-colors ${
										selectedHeroId === hero.id
											? "bg-zinc-800 text-yellow-500 border-t-2 border-yellow-500 shadow-[0_-4px_10px_rgba(202,138,4,0.1)]"
											: "bg-zinc-900 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
									}`}
								>
									{hero.heroClass}
								</button>
							))}
						</div>
					</div>

					<div className="p-8 flex gap-12 h-[600px] overflow-hidden">
						{/* LEFT COLUMN: Equipped Cards */}
						<div className="flex flex-col flex-shrink-0">
							<h3 className="mb-6 text-sm font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
								Active Deck (3/3)
							</h3>
							<div className="flex gap-6">
								{/* Slot 0: Weapon (Locked) */}
								<div className="relative">
									<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30 bg-yellow-600 text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded shadow-md border border-yellow-400">
										Main Weapon
									</div>
									{draftCards[0] && (
										<LoadoutCard {...draftCards[0]} variant="weapon" />
									)}
								</div>

								{/* Slots 1 & 2: Utilities */}
								{[1, 2].map((slotIndex) => {
									const card = draftCards[slotIndex];
									return card ? (
										<motion.div
											key={`slot-${slotIndex}`}
											layoutId={card.id}
											className="relative z-20 group"
										>
											<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30 bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
												Unequip
											</div>
											<LoadoutCard
												{...card}
												variant="utility"
												onClick={() => handleUnequip(slotIndex)}
											/>
										</motion.div>
									) : (
										<div className="w-card-large h-card-large rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center pointer-events-none">
											<span className="text-zinc-700 font-bold uppercase tracking-widest text-xs">
												Empty Slot
											</span>
										</div>
									);
								})}
							</div>
						</div>

						{/* RIGHT COLUMN: Available Utilities */}
						<div className="flex flex-col flex-grow border-l border-zinc-800 pl-12">
							<div className="flex justify-between items-center mb-6">
								<h3 className="text-sm font-bold tracking-widest text-zinc-500 uppercase">
									Available Utilities
								</h3>
								{isFull && (
									<span className="text-xs text-red-400 font-bold uppercase tracking-widest px-2 py-1 bg-red-950/50 rounded border border-red-900/50">
										Loadout Full
									</span>
								)}
							</div>

							<div className="flex gap-6 overflow-y-auto pb-8 pr-4 custom-scrollbar">
								{availableUtilities.map((card) => {
									const isEquipped = draftCards.some((c) => c?.id === card.id);

									// If equipped, leave an empty placeholder so the layout doesn't collapse
									if (isEquipped) {
										return (
											<div
												key={`placeholder-${card.id}`}
												className="shrink-0 w-card-large h-card-large rounded-xl border-2 border-dashed border-zinc-800/50 bg-zinc-900/10"
											/>
										);
									}

									return (
										<motion.div
											layoutId={card.id}
											key={card.id}
										>
											<LoadoutCard
												{...card}
												variant="utility"
												isDisabled={isFull}
												onClick={() => !isFull && handleEquip(card)}
											/>
										</motion.div>
									);
								})}
							</div>
						</div>
					</div>

					{/* Footer Actions */}
					<div className="flex justify-end items-center gap-6 px-8 py-6 border-t border-zinc-800 bg-zinc-900/80">
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-2 font-bold tracking-widest text-zinc-400 transition-colors uppercase hover:text-white"
						>
							Cancel
						</button>
						<button
							type="button"
							disabled={!draftCards[1] && !draftCards[2]}
							onClick={handleSave}
							className="px-8 py-3 font-black tracking-widest text-black transition-all bg-yellow-600 rounded-lg uppercase hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(202,138,4,0.3)] hover:shadow-[0_0_25px_rgba(202,138,4,0.5)] hover:-translate-y-0.5"
						>
							Confirm Loadout
						</button>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
