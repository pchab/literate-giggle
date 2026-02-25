import Image from "next/image";
import { motion } from "motion/react";
import type { Card } from "@/modules/cards/domain/cards.type";

export function CardComponent({ name }: Card) {
	return (
		<motion.div className="relative" whileHover={{ y: -10, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
			<Image src={"/card.png"} alt={name} width={65} height={100} />
			<div className="absolute inset-0 flex justify-center items-center text-sm font-bold text-white">
				{name}
			</div>
		</motion.div>
	);
}
