import { motion } from "motion/react";
import { useEffect } from "react";
import type { VfxType } from "@/modules/grid/vfx/vfx.type";

interface VfxOverlayProps {
	type: VfxType;
	onComplete: () => void;
}

export function VfxOverlay({ type, onComplete }: VfxOverlayProps) {
	useEffect(() => {
		if (!type) return;
		const timer = setTimeout(() => {
			onComplete();
		}, 500);
		return () => clearTimeout(timer);
	}, [type, onComplete]);

	if (!type) return null;

	return (
		<div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
			{type === "SLASH" && (
				<motion.div
					className="w-24 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]"
					initial={{ scale: 0, rotate: -45, opacity: 1 }}
					animate={{
						scale: [0, 1.5, 1.5, 0],
						rotate: [-45, -45, -45, -45],
						opacity: [1, 1, 0, 0],
					}}
					transition={{ duration: 0.3, ease: "easeOut" }}
				/>
			)}

			{type === "HEAL" && (
				<motion.div
					className="w-16 h-16 rounded-full bg-green-400/50 mix-blend-screen filter blur-md"
					initial={{ scale: 0.5, opacity: 0, y: 10 }}
					animate={{
						scale: [0.5, 1.2, 1.5],
						opacity: [0, 1, 0],
						y: [10, -20, -40],
					}}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					{/* Add some inner sparkles */}
					<div className="absolute inset-0 flex items-center justify-center text-green-200 text-2xl font-bold">
						+
					</div>
				</motion.div>
			)}

			{type === "BLOCK" && (
				<motion.div
					className="w-20 h-20 rounded-full border-4 border-blue-400/80 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{
						scale: [0.8, 1.1, 1],
						opacity: [0, 1, 0],
					}}
					transition={{ duration: 0.4, ease: "circOut" }}
				/>
			)}
		</div>
	);
}
