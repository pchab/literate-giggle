import { AnimatePresence, motion } from "motion/react";
import type { CombatText } from "./useCombatText.hook";

export default function FloatingDamage({ texts }: { texts: CombatText[] }) {
	return (
		<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none">
			<AnimatePresence>
				{texts.map((text) => (
					<motion.span
						key={text.id}
						initial={{ opacity: 1, y: 0, scale: 1 }}
						animate={{
							opacity: [1, 1, 0],
							y: [0, -15, -40],
							scale: [1, 1.4, 1],
						}}
						exit={{ opacity: 0 }}
						transition={{ duration: 1, ease: "easeOut" }}
						className={`absolute text-xl font-black drop-shadow-md ${text.type === "damage" ? "text-red-500" : "text-green-400"}`}
						style={{
							textShadow:
								"2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
						}}
					>
						{text.type === "damage" ? "-" : "+"}
						{text.amount}
					</motion.span>
				))}
			</AnimatePresence>
		</div>
	);
}
