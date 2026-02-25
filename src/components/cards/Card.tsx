import { motion } from "motion/react";
import Image from "next/image";
import type { Card } from "@/modules/cards/domain/cards.type";

interface CardComponentProps extends Card {
	isSelected?: boolean;
	isPlayable?: boolean;
}

export function CardComponent({
	name,
	isSelected = false,
	isPlayable = true,
}: CardComponentProps) {
	return (
		<motion.div
			className={`
                relative w-[65px] h-[100px] rounded border border-zinc-700/80 overflow-hidden shadow-lg
                ${!isPlayable ? "opacity-50 grayscale" : ""}
            `}
			animate={{
				y: isSelected ? -15 : 0,
				scale: isSelected ? 1.15 : 1,
				boxShadow: isSelected
					? "0px 0px 15px 0px rgba(59, 130, 246, 0.8)"
					: "0px 4px 6px -1px rgba(0, 0, 0, 0.5)",
				borderColor: isSelected
					? "rgba(96, 165, 250, 1)"
					: "rgba(63, 63, 70, 0.8)",
			}}
			whileHover={isPlayable && !isSelected ? { y: -8, scale: 1.05 } : {}}
			whileTap={isPlayable ? { scale: 0.95 } : {}}
			transition={{ type: "spring", stiffness: 400, damping: 25 }}
		>
			<Image src="/card.png" alt={name} fill className="object-cover z-0" />

			<div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-zinc-950/30 z-10" />

			<div className="absolute inset-0 z-20 flex flex-col justify-end items-center pb-2 px-1">
				<span className="text-[10px] font-bold text-zinc-100 text-center leading-tight drop-shadow-md">
					{name}
				</span>
			</div>
		</motion.div>
	);
}
