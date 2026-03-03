import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { QuestTracker } from "@/modules/campaign/components/QuestTracker";
import { HandMenu } from "@/modules/cards/components/HandMenu";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { RetroPanel } from "./RetroPanel";

type MenuTab = "LOADOUT" | "QUESTS";

interface MenuModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSaveLoadout: (
		heroId: Hero["id"],
		newCards: [Card["id"], Card["id"], Card["id"] | null],
	) => void;
}

export function MenuModal({ isOpen, onClose, onSaveLoadout }: MenuModalProps) {
	const [activeTab, setActiveTab] = useState<MenuTab>("LOADOUT");

	// Reset tab to default whenever opened
	useEffect(() => {
		if (isOpen) {
			setActiveTab("LOADOUT");
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md font-sans p-4 md:p-12"
			>
				<motion.div
					initial={{ scale: 0.95, y: 20 }}
					animate={{ scale: 1, y: 0 }}
					exit={{ scale: 0.95, y: 20 }}
					className="flex flex-col w-full max-w-6xl h-full max-h-[850px]"
				>
					<RetroPanel className="flex flex-col p-0 h-full overflow-hidden shadow-2xl">
						{/* --- MASTER MENU NAVIGATION --- */}
						<div className="flex items-center justify-between px-8 bg-zinc-950 border-b-4 border-zinc-700">
							<div className="flex gap-4 pt-4">
								<button
									type="button"
									onClick={() => setActiveTab("LOADOUT")}
									className={`px-8 py-4 font-pixel text-xl tracking-widest uppercase transition-all ${
										activeTab === "LOADOUT"
											? "bg-zinc-900 text-amber-500 border-t-4 border-x-4 border-zinc-700 translate-y-[4px] pb-5"
											: "bg-zinc-950 text-zinc-500 border-t-4 border-x-4 border-transparent hover:text-zinc-300 hover:bg-zinc-900"
									}`}
								>
									Camp Loadout
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("QUESTS")}
									className={`px-8 py-4 font-pixel text-xl tracking-widest uppercase transition-all ${
										activeTab === "QUESTS"
											? "bg-zinc-900 text-amber-500 border-t-4 border-x-4 border-zinc-700 translate-y-[4px] pb-5"
											: "bg-zinc-950 text-zinc-500 border-t-4 border-x-4 border-transparent hover:text-zinc-300 hover:bg-zinc-900"
									}`}
								>
									Quest Log
								</button>
							</div>

							{/* Global Close Button */}
							<button
								type="button"
								onClick={onClose}
								className="text-zinc-500 hover:text-red-500 font-pixel text-2xl p-4 transition-colors"
							>
								✕
							</button>
						</div>

						{/* --- TAB CONTENT AREA --- */}
						<div className="grow overflow-hidden relative min-h-[600px]">
							{activeTab === "LOADOUT" && (
								<HandMenu onSaveLoadout={onSaveLoadout} />
							)}

							{activeTab === "QUESTS" && (
								<div className="absolute inset-0">
									<QuestTracker />
								</div>
							)}
						</div>
					</RetroPanel>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
