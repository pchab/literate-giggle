import { motion } from "motion/react";
import Image from "next/image";
import { formatCardEffect } from "@/modules/cards/cards.helper";
import type { Card } from "@/modules/cards/domain/cards.type";

export interface LoadoutCardProps extends Card {
	isSelected?: boolean;
	isDisabled?: boolean;
	variant?: "weapon" | "utility" | "default";
	onClick?: () => void;
}

export function LoadoutCard({
	name,
	range,
	playRequirement,
	effects,
	xp,
	isSelected = false,
	isDisabled = false,
	variant = "default",
	onClick,
}: LoadoutCardProps) {
	// Theme configuration based on card type
	const theme = {
		weapon: {
			border: isSelected ? "border-yellow-400" : "border-yellow-600/60",
			glow: "shadow-[0_0_15px_rgba(202,138,4,0.3)]",
			text: "text-yellow-500",
			bg: "bg-zinc-900",
		},
		utility: {
			border: isSelected ? "border-blue-400" : "border-blue-600/60",
			glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
			text: "text-blue-400",
			bg: "bg-zinc-900",
		},
		default: {
			border: isSelected ? "border-zinc-300" : "border-zinc-600/80",
			glow: "shadow-lg",
			text: "text-zinc-200",
			bg: "bg-zinc-900",
		},
	}[variant];

	const formattedReq = playRequirement.replace(/_/g, " ").toUpperCase();

	return (
		<motion.div
			onClick={!isDisabled ? onClick : undefined}
			className={`relative w-card-large h-card-large rounded-xl border-2 overflow-hidden flex flex-col group
        ${theme.bg} ${theme.border} ${theme.glow}
        ${isDisabled ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer"}
    `}
			animate={{
				y: isSelected ? -10 : 0,
				scale: isSelected ? 1.05 : 1,
			}}
			whileHover={!isDisabled && !isSelected ? { y: -5, scale: 1.02 } : {}}
			whileTap={!isDisabled ? { scale: 0.98 } : {}}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			{/* Background Texture */}
			<div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none">
				<Image
					src="/card.png"
					alt="card background"
					fill
					className="object-cover"
				/>
			</div>

			{/* Top Bar: Range & Level */}
			<div className="relative z-10 flex justify-between p-3 pb-0 pointer-events-none">
				<div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-zinc-950 border border-zinc-700 shadow-inner font-bold text-sm text-zinc-200">
					{range}
					<span className="text-[7px] leading-none text-zinc-500 uppercase tracking-widest mt-0.5">
						RNG
					</span>
				</div>
				<div className="flex items-center justify-center h-6 px-2 rounded bg-zinc-950 border border-zinc-700 font-bold text-[10px] uppercase tracking-wider text-zinc-400">
					Lvl {xp}
				</div>
			</div>

			{/* Art Placeholder */}
			<div className="relative z-10 flex-grow px-4 py-2 pointer-events-none">
				<div className="w-full h-full border border-zinc-700/50 rounded flex items-center justify-center bg-zinc-950/50 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]">
					<span className="text-4xl opacity-30 drop-shadow-lg filter grayscale group-hover:grayscale-0 transition-all duration-300">
						{variant === "weapon" ? "⚔️" : "✨"}
					</span>
				</div>
			</div>

			{/* Text & Effects Area */}
			<div className="relative z-20 flex flex-col items-center px-4 pb-4 pt-6 bg-gradient-to-t from-zinc-950 via-zinc-900/95 to-transparent mt-auto pointer-events-none">
				<h3
					className={`text-lg font-black text-center tracking-wider leading-none uppercase drop-shadow-md ${theme.text}`}
				>
					{name}
				</h3>

				<span className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] mt-1 mb-2">
					{variant} Card
				</span>

				<div className="w-full border-t border-zinc-800 my-2 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />

				<p className="text-[10px] text-zinc-400 text-center uppercase tracking-wider font-bold mb-2">
					{formattedReq}
				</p>

				<div className="flex flex-wrap justify-center gap-1.5 mt-1">
					{effects.map((effect, idx) => (
						<span
							key={idx}
							className="text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300 border border-zinc-700 uppercase tracking-wider"
						>
							{formatCardEffect(effect)}
						</span>
					))}
				</div>
			</div>
		</motion.div>
	);
}
