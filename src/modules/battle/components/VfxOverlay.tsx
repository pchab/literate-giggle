import { motion } from "motion/react";
import { useEffect } from "react";
import type { Vfx } from "@/modules/battle/domain/vfx.type";

interface VfxOverlayProps {
	vfx?: Vfx;
	onComplete: () => void;
}

export function VfxOverlay({ vfx, onComplete }: VfxOverlayProps) {
	useEffect(() => {
		if (!vfx) return;
		const timer = setTimeout(() => {
			onComplete();
		}, 1000);
		return () => clearTimeout(timer);
	}, [vfx, onComplete]);

	if (!vfx) return null;
	const { type, id = crypto.randomUUID() } = vfx;

	return (
		<motion.div
			className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
			layoutId={id}
			initial={{ rotate: vfx.angle ?? 0 }}
		>
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
					layoutId={id}
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
					layoutId={id}
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
					layoutId={id}
				/>
			)}

			{type === "POISON" && (
				<motion.div
					className="w-16 h-16 rounded-full bg-purple-500/60 mix-blend-screen filter blur-md"
					initial={{ scale: 0.4, opacity: 0, y: 5 }}
					animate={{
						scale: [0.4, 1.3, 1.6],
						opacity: [0, 0.8, 0],
						y: [5, -15, -30],
					}}
					transition={{ duration: 0.5, ease: "easeOut" }}
					layoutId={id}
				>
					<div className="absolute inset-0 flex items-center justify-center text-purple-200 text-2xl drop-shadow-md">
						☠️
					</div>
				</motion.div>
			)}

			{type === "ARROW" && (
				<div className="w-1 h-8 bg-zinc-400 relative">
					<div className="absolute -right-0.5 -top-1 border-x-4 border-x-transparent border-b-8 border-b-zinc-300" />
				</div>
			)}

			{type === "FIREBALL" && (
				<div className="w-8 h-8 bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,1)] flex items-center justify-end">
					<div className="w-4 h-4 bg-yellow-300 rounded-full mr-1" />
				</div>
			)}

			{type === "ACID_SPIT" && (
				<div className="w-6 h-6 bg-green-500 rounded-full mix-blend-screen filter blur-[2px] shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
			)}

			{type === "FIRE" && (
				<motion.div
					className="w-20 h-20 rounded-full mix-blend-screen filter blur-sm"
					style={{ backgroundColor: "#fbbf24" }}
					initial={{ scale: 0, opacity: 1 }}
					animate={{
						scale: [0, 1.5, 2],
						backgroundColor: ["#fbbf24", "#f97316", "#ef4444"],
						opacity: [1, 1, 0],
					}}
					transition={{ duration: 0.4, ease: "easeOut" }}
				/>
			)}

			{type === "BLUNT" && (
				<div className="relative w-24 h-24 flex items-center justify-center">
					<motion.div
						className="absolute w-16 h-16 rounded-full bg-zinc-300 shadow-[0_0_15px_rgba(212,212,216,0.8)]"
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{
							scale: [0.8, 1.2, 1],
							opacity: [0, 1, 0],
						}}
						transition={{ duration: 0.4, ease: "backOut" }}
					/>
					<motion.div
						className="absolute w-16 h-16 rounded-full border-8 border-zinc-500/80"
						initial={{ scale: 1, opacity: 0 }}
						animate={{
							scale: [0.6, 1.2, 1.5],
							borderWidth: ["8px", "2px", "0px"],
							opacity: [0, 0.8, 0],
						}}
						transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
					/>
				</div>
			)}

			{type === "ICE" && (
				<div className="relative w-24 h-24 flex items-center justify-center">
					<motion.div
						className="absolute w-20 h-20 rounded-sm bg-cyan-300/60 mix-blend-screen filter blur-[2px] shadow-[0_0_10px_rgba(103,232,249,0.8)]"
						initial={{ scale: 0, rotate: 15, opacity: 0 }}
						animate={{
							scale: [0, 1.1, 1],
							rotate: [15, -15, 0],
							opacity: [0, 0.9, 0],
						}}
						transition={{ duration: 0.7, ease: "circOut" }}
					/>
					<motion.div
						className="absolute w-12 h-12 rounded-sm bg-sky-200/50 mix-blend-screen blur-md"
						initial={{ scale: 0, opacity: 0 }}
						animate={{
							scale: [0, 1.3, 1],
							opacity: [0, 0.7, 0],
						}}
						transition={{ duration: 0.8, ease: "circOut", delay: 0.1 }}
					/>
				</div>
			)}
		</motion.div>
	);
}
