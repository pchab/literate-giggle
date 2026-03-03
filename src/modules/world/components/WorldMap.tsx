"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { QUEST_DB } from "@/modules/campaign/data/quests.data";
import type { Quest, QuestStep } from "@/modules/campaign/domain/quests.type";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { MenuModal } from "@/modules/shared/components/MenuModal";
import { useWorldStore } from "@/modules/world/store/world.store";
import { useMapInterceptor } from "../hooks/useMapInterceptor";

// Helper mappings for visuals
const NODE_ICONS = {
	TOWN: "🏰",
	BATTLE: "⚔️",
	CAMP: "⛺",
	EVENT: "❓",
};

const NODE_STYLES = {
	TOWN: "bg-gradient-to-br from-blue-600 to-blue-800 border-blue-400 text-blue-100",
	BATTLE:
		"bg-gradient-to-br from-red-600 to-red-800 border-red-400 text-red-100",
	CAMP: "bg-gradient-to-br from-green-600 to-green-800 border-green-400 text-green-100",
	EVENT:
		"bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400 text-purple-100",
};

export default function WorldMap() {
	const { mapData, currentNodeId, updateHand } = useWorldStore(
		useShallow((state) => ({
			mapData: state.mapData,
			currentNodeId: state.currentNodeId,
			updateHand: state.updateHand,
		})),
	);
	const activeQuests = useCampaignStore((state) => state.activeQuests);

	const { handleNodeClick, isTraveling } = useMapInterceptor();

	// --- NEW: State for the Loadout Modal ---
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const nodes = Object.values(mapData);
	const currentNode = mapData[currentNodeId];
	const questTargetNodeIds = new Set(
		Object.entries(activeQuests)
			.map(([questId, stepId]) => {
				const quest = QUEST_DB[questId as Quest["id"]];
				return quest?.steps[stepId as QuestStep["id"]]?.targetNodeId;
			})
			.filter(Boolean),
	);

	return (
		<div className="relative w-full h-full bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden group/map">
			{/* 1. The New Fantasy Map Background */}
			<Image
				src="/world_map.jpg"
				alt="Fantasy World Map"
				fill
				className="object-cover object-center pointer-events-none z-0 opacity-80"
				quality={100}
			/>

			{/* Optional: A slight vignette/darkening overlay */}
			<div className="absolute inset-0 bg-zinc-950/30 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none z-0" />

			{/* 2. SVG LAYER: Animated connecting paths */}
			<svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
				<title>connections</title>
				{nodes.map((node) =>
					node.connectedNodeIds.map((targetId) => {
						const targetNode = mapData[targetId];
						if (node.id > targetId) return null;

						const isTravelable =
							(node.id === currentNodeId &&
								currentNode.connectedNodeIds.includes(targetId)) ||
							(targetId === currentNodeId &&
								currentNode.connectedNodeIds.includes(node.id));

						return (
							<motion.line
								key={`${node.id}-${targetId}`}
								x1={`${node.position.x}%`}
								y1={`${node.position.y}%`}
								x2={`${targetNode.position.x}%`}
								y2={`${targetNode.position.y}%`}
								stroke={isTravelable ? "#d4d4d8" : "#3f3f46"}
								strokeWidth={isTravelable ? "3" : "2"}
								strokeDasharray="8 8"
								animate={isTravelable ? { strokeDashoffset: [0, -16] } : {}}
								transition={
									isTravelable
										? { repeat: Infinity, duration: 1, ease: "linear" }
										: {}
								}
								className={
									isTravelable
										? "drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"
										: ""
								}
							/>
						);
					}),
				)}
			</svg>

			{/* 3. HTML LAYER: Render the clickable locations */}
			{nodes.map((node) => {
				const isCurrentNode = node.id === currentNodeId;
				const isReachable = currentNode.connectedNodeIds.includes(node.id);
				const isLocked = !isReachable && !isCurrentNode;

				return (
					<div
						key={node.id}
						className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
						style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
					>
						{/* The Node Button */}
						<div className="relative group">
							{questTargetNodeIds.has(node.id) && (
								<motion.div
									initial={{ y: 0 }}
									animate={{ y: [-4, 4, -4] }}
									transition={{
										repeat: Infinity,
										duration: 1.5,
										ease: "easeInOut",
									}}
									className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
								>
									<div className="bg-amber-500 border-2 border-amber-900 rounded-full w-6 h-6 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.8)]">
										<span className="font-pixel text-amber-100 text-xs font-bold drop-shadow-md">
											!
										</span>
									</div>
									{/* Little triangle pointing down */}
									<div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[6px] border-t-amber-500 mx-auto -mt-0.5 drop-shadow-md" />
								</motion.div>
							)}
							{/* "You Are Here" Pulsing Ring */}
							{isCurrentNode && (
								<motion.div
									className="absolute -inset-3 rounded-full border-2 border-white/50 pointer-events-none"
									animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
									transition={{
										repeat: Infinity,
										duration: 2,
										ease: "easeOut",
									}}
								/>
							)}

							<motion.button
								type="button"
								onClick={() => {
									handleNodeClick(node.id, node.type);
								}}
								disabled={isLocked}
								whileHover={isReachable ? { scale: 1.15 } : {}}
								whileTap={isReachable ? { scale: 0.95 } : {}}
								className={`
                                    flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-lg transition-all
                                    ${NODE_STYLES[node.type]}
                                    ${isCurrentNode ? "ring-4 ring-white/30 border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]" : ""}
                                    ${isReachable ? "cursor-pointer hover:border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" : ""}
                                    ${isLocked ? "opacity-40 grayscale-80 cursor-not-allowed border-zinc-700 shadow-none" : ""}
                                `}
							>
								<span className="text-lg drop-shadow-md">
									{NODE_ICONS[node.type]}
								</span>
							</motion.button>

							{/* Node Tooltip */}
							<div
								className={`
                                absolute bottom-[120%] left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 
                                bg-zinc-900 border border-zinc-700 rounded-md shadow-xl
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                                pointer-events-none whitespace-nowrap z-50 flex flex-col items-center
                                ${isLocked ? "hidden" : "block"}
                            `}
							>
								<span className="text-sm font-bold text-zinc-100">
									{node.name}
								</span>
								{isReachable && (
									<span className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
										Click to Travel
									</span>
								)}
							</div>
						</div>
					</div>
				);
			})}

			{/* Map Legend (Bottom Left) */}
			<div className="absolute bottom-4 left-4 bg-zinc-950/80 border border-zinc-800 p-3 rounded-lg backdrop-blur-sm z-30 pointer-events-none">
				<h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
					Legend
				</h4>
				<div className="flex gap-3 text-xs text-zinc-300">
					<span className="flex items-center gap-1">🏰 Town</span>
					<span className="flex items-center gap-1">⚔️ Battle</span>
					<span className="flex items-center gap-1">⛺ Camp</span>
				</div>
			</div>

			{/* --- NEW: Deck menu Button (Top Right) --- */}
			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={() => setIsMenuOpen(true)}
				className="absolute z-30 top-6 right-6 flex items-center gap-2 px-6 py-3 font-bold text-black uppercase tracking-widest transition-colors bg-yellow-600 rounded-lg shadow-[0_0_15px_rgba(202,138,4,0.4)] hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(202,138,4,0.6)]"
			>
				Menu
			</motion.button>

			{/* --- NEW: The Hand Modal --- */}
			<MenuModal
				isOpen={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
				onSaveLoadout={updateHand}
			/>

			<AnimatePresence>
				{isTraveling && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5, ease: "easeInOut" }}
						className="absolute inset-0 z-100 bg-black pointer-events-none flex items-center justify-center"
					>
						<span className="text-zinc-500 font-pixel tracking-widest uppercase animate-pulse">
							Traveling...
						</span>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
