import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { RetroButton } from "@/components/ui/RetroButton";
import { RetroPanel } from "@/components/ui/RetroPanel";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useWorldStore } from "@/store/world.store";
import { LoadoutCard } from "./cards/LoadoutCard";

interface LoadoutModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSaveLoadout: (
		heroId: Hero["id"],
		newCards: [Card["id"], Card["id"], Card["id"] | null],
	) => void;
}

export function LoadoutModal({
	isOpen,
	onClose,
	onSaveLoadout,
}: LoadoutModalProps) {
	const roster = useWorldStore((state) => state.roster);

	const [selectedHeroId, setSelectedHeroId] = useState<Hero["id"] | null>(null);
	const [draftCards, setDraftCards] = useState<(Card["id"] | null)[]>([
		null,
		null,
		null,
	]);

	useEffect(() => {
		if (isOpen && roster.length > 0) {
			const initialHero = roster[0];
			setSelectedHeroId(initialHero.id);
			setDraftCards([...initialHero.hand]);
		}
	}, [isOpen, roster]);

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

		const weapon = draftCards[0] as Card["id"];
		const utility1 = (draftCards[1] || draftCards[2]) as Card["id"];
		const utility2 = draftCards[1] && draftCards[2] ? draftCards[2] : null;

		onSaveLoadout(selectedHeroId, [weapon, utility1, utility2]);
		onClose();
	};

	if (!isOpen) return null;

	const selectedHero = roster.find((h) => h.id === selectedHeroId);
	if (!selectedHero) return null;

	const weaponId = selectedHero.hand[0];
	const availableUtilities = selectedHero.deck.filter(
		(cId) => cId !== weaponId,
	);
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
					className="flex flex-col m-auto"
				>
					<RetroPanel className="flex flex-col p-0">
						{/* Header & Hero Selection */}
						<div className="flex items-end justify-between px-8 pt-8 pb-4 border-b-4 border-slate-700 bg-slate-800">
							<div>
								<h2 className="text-4xl font-pixel tracking-widest text-shadow-pixel text-yellow-500 uppercase">
									Camp Loadout
								</h2>
								<p className="text-sm font-bold text-slate-300 mt-1 uppercase">
									Prepare your squad's deck for the next battle.
								</p>
							</div>
							<div className="flex gap-2">
								{roster.map((hero) => (
									<button
										type="button"
										key={hero.id}
										onClick={() => handleSelectHero(hero)}
										className={`px-6 py-3 font-pixel text-2xl tracking-widest uppercase transition-colors text-shadow-pixel ${
											selectedHeroId === hero.id
												? "bg-slate-700 text-yellow-500 border-t-4 border-x-4 border-slate-500 shadow-[inset_0_4px_0_rgba(255,255,255,0.2)]"
												: "bg-slate-900 text-slate-500 hover:text-slate-300 border-t-4 border-x-4 border-transparent hover:border-slate-800"
										}`}
									>
										{hero.id}
									</button>
								))}
							</div>
						</div>

						<div className="p-8 flex gap-12 bg-slate-900">
							{/* LEFT COLUMN: Equipped Cards */}
							<div className="flex flex-col shrink-0">
								<h3 className="mb-6 font-pixel text-2xl tracking-widest text-slate-300 uppercase flex items-center gap-2">
									<span className="w-3 h-3 bg-green-500 border-2 border-black animate-pulse shadow-[2px_2px_0_rgba(0,0,0,0.5)]" />
									Active Deck (3/3)
								</h3>
								<div className="flex gap-6">
									{/* Slot 0: Weapon (Locked) */}
									<div className="relative">
										<div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-30 bg-yellow-600 text-white px-3 py-1 font-pixel text-lg shadow-[inset_0_0_0_2px_rgba(255,255,255,0.4),3px_3px_0px_0px_rgba(0,0,0,0.8)] border-2 border-black tracking-widest uppercase whitespace-nowrap">
											Main Weapon
										</div>
										{draftCards[0] && (
											<LoadoutCard cardId={draftCards[0]} variant="weapon" />
										)}
									</div>

									{/* Slots 1 & 2: Utilities */}
									{[1, 2].map((slotIndex) => {
										const cardId = draftCards[slotIndex];
										return cardId ? (
											<motion.div
												key={`slot-${slotIndex}`}
												layoutId={cardId}
												className="relative z-20 group"
											>
												<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30 bg-red-600 text-white px-3 py-1 font-pixel text-lg shadow-[inset_0_0_0_2px_rgba(255,255,255,0.4),3px_3px_0px_0px_rgba(0,0,0,0.8)] border-2 border-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
												className="w-card-large h-card-large bg-slate-950 border-4 border-dashed border-slate-800 flex flex-col items-center justify-center pointer-events-none shadow-inner"
											>
												<span className="text-slate-700 font-pixel text-xl uppercase tracking-widest">
													Empty Slot
												</span>
											</div>
										);
									})}
								</div>
							</div>

							{/* RIGHT COLUMN: Available Utilities */}
							<div className="flex flex-col grow border-l-4 border-slate-800 pl-12">
								<div className="flex justify-between items-center mb-6">
									<h3 className="font-pixel text-2xl tracking-widest text-slate-400 uppercase">
										Available Utilities
									</h3>
									{isFull && (
										<span className="text-red-400 font-pixel text-xl uppercase tracking-widest px-3 py-1 bg-red-950 border-2 border-red-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
											Hand Full
										</span>
									)}
								</div>

								<div className="flex gap-6 pb-8 pr-4 custom-scrollbar">
									{availableUtilities.map((cardId) => {
										const isEquipped = draftCards.some((cId) => cId === cardId);

										// If equipped, leave an empty placeholder so the layout doesn't collapse
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

						{/* Footer Actions */}
						<div className="flex justify-end items-center gap-6 px-8 py-6 border-t-4 border-slate-700 bg-slate-800">
							<button
								type="button"
								onClick={onClose}
								className="px-6 py-2 font-pixel text-2xl tracking-widest text-slate-400 transition-colors uppercase hover:text-white"
							>
								Cancel
							</button>
							<RetroButton
								disabled={!draftCards[1] && !draftCards[2]}
								onClick={handleSave}
								variant="warning"
							>
								Confirm Hand
							</RetroButton>
						</div>
					</RetroPanel>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
