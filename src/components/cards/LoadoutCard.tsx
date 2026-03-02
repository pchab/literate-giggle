import { motion } from "motion/react";
import Image from "next/image";
import { formatCardEffect } from "@/modules/cards/cards.helper";
import { cardLibrary } from "@/modules/cards/domain/cards.data";
import type { Card } from "@/modules/cards/domain/cards.type";

export type LoadoutCardProps = {
	cardId: Card["id"];
	isSelected?: boolean;
	isDisabled?: boolean;
	variant?: "weapon" | "utility" | "default";
	onClick?: () => void;
};

export function LoadoutCard({
	cardId,
	isSelected = false,
	isDisabled = false,
	variant = "default",
	onClick,
}: LoadoutCardProps) {
	const { playRequirement, effects, name } = cardLibrary[cardId];
	const theme = {
		weapon: {
			border: isSelected ? "border-yellow-400" : "border-yellow-700",
			glow: isSelected
				? "shadow-[inset_0_0_0_2px_rgba(255,255,255,0.3),_6px_6px_0_rgba(202,138,4,0.6)]"
				: "shadow-[inset_0_0_0_2px_rgba(255,255,255,0.1),_4px_4px_0_rgba(0,0,0,1)]",
			text: "text-yellow-400 text-shadow-pixel",
			bg: "bg-slate-800",
		},
		utility: {
			border: isSelected ? "border-blue-400" : "border-blue-700",
			glow: isSelected
				? "shadow-[inset_0_0_0_2px_rgba(255,255,255,0.3),_6px_6px_0_rgba(59,130,246,0.6)]"
				: "shadow-[inset_0_0_0_2px_rgba(255,255,255,0.1),_4px_4px_0_rgba(0,0,0,1)]",
			text: "text-blue-400 text-shadow-pixel",
			bg: "bg-slate-800",
		},
		default: {
			border: isSelected ? "border-slate-300" : "border-slate-600",
			glow: isSelected
				? "shadow-[inset_0_0_0_2px_rgba(255,255,255,0.3),_6px_6px_0_rgba(148,163,184,0.6)]"
				: "shadow-[inset_0_0_0_2px_rgba(255,255,255,0.1),_4px_4px_0_rgba(0,0,0,1)]",
			text: "text-slate-200 text-shadow-pixel",
			bg: "bg-slate-800",
		},
	}[variant];

	const formattedReq = playRequirement.replace(/_/g, " ").toUpperCase();

	return (
		<motion.div
			onClick={!isDisabled ? onClick : undefined}
			className={`relative w-card-large h-card-large border-4 flex flex-col group
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

			{/* Art Placeholder */}
			<div className="relative z-10 grow px-4 py-2 pointer-events-none">
				<div className="w-full h-full border-2 border-slate-700 flex items-center justify-center bg-slate-900 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5),2px_2px_0_rgba(255,255,255,0.1)]">
					<span className="text-4xl opacity-30 drop-shadow-lg filter grayscale group-hover:grayscale-0 transition-all duration-300">
						{variant === "weapon" ? "⚔️" : "✨"}
					</span>
				</div>
			</div>

			{/* Text & Effects Area */}
			<div className="relative z-20 flex flex-col items-center px-2 pb-4 pt-6 bg-linear-to-t from-slate-950 via-slate-900/95 to-transparent mt-auto pointer-events-none border-t border-slate-800">
				<h3
					className={`text-2xl font-pixel text-center tracking-wider leading-none uppercase ${theme.text}`}
				>
					{name}
				</h3>

				<span className="text-[10px] font-pixel text-slate-400 uppercase tracking-[0.2em] mt-1 mb-2">
					{variant} Card
				</span>

				<div className="w-full border-t-2 border-slate-800 my-2 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />

				<p className="text-[12px] font-pixel text-slate-300 text-center uppercase tracking-wider mb-2">
					{formattedReq}
				</p>

				<div className="flex flex-wrap justify-center gap-1.5 mt-1">
					{effects.map((effect, idx) => (
						<span
							key={idx}
							className="text-[12px] font-pixel px-1.5 py-0.5 bg-slate-800 text-slate-200 border-2 border-slate-700 uppercase tracking-wider shadow-[2px_2px_0_rgba(0,0,0,0.5)] pt-1 text-center leading-none"
						>
							{formatCardEffect(effect)}
						</span>
					))}
				</div>
			</div>
		</motion.div>
	);
}
