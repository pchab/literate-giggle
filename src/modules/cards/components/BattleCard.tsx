import { motion } from "motion/react";
import Image from "next/image";
import { cardLibrary } from "../data/cards.data";
import type { Card } from "../domain/cards.type";

interface BattleCardProps {
	cardId: Card["id"];
	isSelected?: boolean;
	isPlayable?: boolean;
	onClick?: () => void;
}

export function BattleCard({
	cardId,
	isSelected = false,
	isPlayable = true,
	onClick,
}: BattleCardProps) {
	const card = cardLibrary[cardId];

	if (!card) {
		return null;
	}

	const { name, range, effects } = card;
	const primaryEffect = effects[0];

	let icon = "✨";
	let glowColor = "rgba(255, 255, 255, 0.2)";
	let accentColor = "text-zinc-300";

	if (primaryEffect) {
		switch (primaryEffect.type) {
			case "damage":
				icon = "⚔️";
				glowColor = "rgba(220, 38, 38, 0.5)"; // Red
				accentColor = "text-red-300";
				break;
			case "heal":
				icon = "💚";
				glowColor = "rgba(34, 197, 94, 0.4)"; // Green
				accentColor = "text-green-300";
				break;
			case "block":
				icon = "🛡️";
				glowColor = "rgba(59, 130, 246, 0.5)"; // Blue
				accentColor = "text-blue-300";
				break;
			case "push":
				icon = "💨";
				glowColor = "rgba(168, 85, 247, 0.5)"; // Purple
				accentColor = "text-purple-300";
				break;
			case "summon":
				icon = "🌀";
				glowColor = "rgba(234, 179, 8, 0.5)"; // Yellow
				accentColor = "text-yellow-300";
				break;
		}
	}

	return (
		<motion.div
			onClick={onClick}
			className={`
                relative w-card h-card rounded-md overflow-hidden shadow-xl bg-zinc-950
                ${!isPlayable ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer"}
                group
            `}
			animate={{
				y: isSelected ? -15 : 0,
				scale: isSelected ? 1.1 : 1,
				boxShadow: isSelected
					? `0px 0px 20px 0px ${glowColor.replace("0.5", "0.8")}`
					: "0px 6px 12px -2px rgba(0, 0, 0, 0.8)",
			}}
			whileHover={isPlayable && !isSelected ? { y: -8, scale: 1.05 } : {}}
			whileTap={isPlayable ? { scale: 0.95 } : {}}
			transition={{ type: "spring", stiffness: 400, damping: 25 }}
		>
			{/* 1. Base Frame */}
			<Image
				src="/card.png"
				alt={name}
				fill
				className="object-cover z-20 pointer-events-none"
			/>

			{/* 2. Top Half: Illustration Placeholder (Behind the frame's visual space, overlaying the dark grey) */}
			<div
				className="absolute top-[6%] left-[6%] right-[6%] bottom-[50%] z-10 overflow-hidden rounded-t-sm flex items-center justify-center mix-blend-screen"
				style={{
					background: `linear-gradient(to bottom, ${glowColor}, transparent)`,
				}}
			>
				{/* Big watermark icon until you have pixel art */}
				<span className="text-6xl opacity-30 drop-shadow-md filter group-hover:scale-110 transition-transform duration-500">
					{icon}
				</span>
			</div>

			{/* 3. Top-Left Diamond: Range Indicator */}
			{/* Precise absolute positioning to perfectly overlay the cyan diamond */}
			<div className="absolute top-[2%] left-[3%] z-30 w-[18px] h-[18px] flex items-center justify-center pointer-events-none">
				<span className="text-[10px] font-black text-cyan-100 drop-shadow-[0_0_3px_rgba(0,255,255,0.8)] leading-none">
					{range}
				</span>
			</div>

			{/* 4. Center Ring: The Primary Effect Value */}
			{/* 50% / 50% with negative translation guarantees it sits dead-center in the ring */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center text-xs pointer-events-none">
				{icon}
			</div>

			{/* 5. Bottom Half: Text Box */}
			<div className="absolute top-[58%] bottom-[6%] left-[5%] right-[5%] z-30 flex flex-col justify-start items-center text-center pointer-events-none pt-2">
				<h3
					className={`text-[10px] font-bold leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,1)] ${accentColor}`}
				>
					{name}
				</h3>

				{/* A tiny separator line */}
				<div className="w-1/2 h-px bg-zinc-700/50 my-1.5" />

				{/* Effect Type String */}
				<span className="text-[8px] font-bold tracking-widest text-zinc-400 uppercase drop-shadow-md">
					{primaryEffect?.type || "Utility"}
				</span>
			</div>

			{/* Optional: Selected Overlay Ring */}
			{isSelected && (
				<div
					className="absolute inset-0 z-40 border-2 rounded-md pointer-events-none"
					style={{ borderColor: accentColor.replace("text-", "border-") }}
				/>
			)}
		</motion.div>
	);
}
