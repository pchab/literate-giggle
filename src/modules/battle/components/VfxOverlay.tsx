import { motion } from "motion/react";
import { type ReactElement, useEffect } from "react";
import {
	isProjectile,
	type Vfx,
	type VfxType,
} from "@/modules/battle/domain/vfx.type";

interface VfxOverlayProps {
	vfx?: Vfx;
	onComplete: () => void;
}

const VfxMapping: Record<NonNullable<VfxType>, ReactElement> = {
	SLASH: (
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
	),
	HEAL: (
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
			<div className="absolute inset-0 flex items-center justify-center text-green-200 text-2xl font-bold">
				+
			</div>
		</motion.div>
	),
	BLOCK: (
		<motion.div
			className="w-20 h-20 rounded-full border-4 border-blue-400/80 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{
				scale: [0.8, 1.1, 1],
				opacity: [0, 1, 0],
			}}
			transition={{ duration: 0.4, ease: "circOut" }}
		/>
	),
	POISON: (
		<motion.div
			className="w-16 h-16 rounded-full bg-purple-500/60 mix-blend-screen filter blur-md"
			initial={{ scale: 0.4, opacity: 0, y: 5 }}
			animate={{
				scale: [0.4, 1.3, 1.6],
				opacity: [0, 0.8, 0],
				y: [5, -15, -30],
			}}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			<div className="absolute inset-0 flex items-center justify-center text-purple-200 text-2xl drop-shadow-md">
				☠️
			</div>
		</motion.div>
	),
	ARROW: (
		<motion.div
			className="w-8 h-1 bg-zinc-400 relative"
			transition={{ duration: 0.9 }}
		>
			<div className="absolute -right-1 -top-0.5 border-y-4 border-l-8 border-y-transparent border-r-zinc-300" />
		</motion.div>
	),
	FIREBALL: (
		<div className="w-8 h-8 bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,1)] flex items-center justify-end">
			<div className="w-4 h-4 bg-yellow-300 rounded-full mr-1" />
		</div>
	),
	ACID_SPIT: (
		<div className="w-6 h-6 bg-green-500 rounded-full mix-blend-screen filter blur-[2px] shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
	),
	FIRE: (
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
	),
	BLUNT: (
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
	),
	ICE: (
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
	),
	NECROBOLT: (
		<div className="relative w-16 h-16 flex items-center justify-center">
			<motion.div
				className="absolute w-12 h-12 rounded-full mix-blend-screen filter blur-[2px] opacity-70 shadow-[0_0_10px_rgba(34,197,94,0.7)]"
				style={{ backgroundColor: "#22c55e" }}
				initial={{ scale: 0.8, rotate: 0 }}
				animate={{
					scale: [0.8, 1.2, 0.8],
					rotate: [0, 360, 720],
				}}
				transition={{ duration: 1, ease: "linear", repeat: Infinity }}
			/>

			<motion.div
				className="absolute w-6 h-6 rounded-full bg-zinc-950 shadow-[0_0_8px_rgba(107,33,168,0.9)]"
				initial={{ scale: 1 }}
				animate={{
					scale: [1, 1.2, 1],
				}}
				transition={{ duration: 0.5, ease: "easeInOut", repeat: Infinity }}
			/>
		</div>
	),
	NECROTIC_IMPACT: (
		<div className="relative w-24 h-24 flex items-center justify-center">
			<motion.div
				className="absolute w-20 h-20 rounded-full mix-blend-screen filter blur-sm shadow-[0_0_20px_rgba(34,197,94,1)]"
				style={{ backgroundColor: "#22c55e" }}
				initial={{ scale: 0, opacity: 1 }}
				animate={{
					scale: [0, 1.4, 1.6],
					backgroundColor: ["#22c55e", "#15803d", "#052e16"],
					opacity: [1, 1, 0],
				}}
				transition={{ duration: 0.5, ease: "circOut" }}
			/>

			<motion.div
				className="absolute w-12 h-12 rounded-sm bg-purple-950 filter blur-md"
				initial={{ scale: 0.5, opacity: 0, y: 0 }}
				animate={{
					scale: [0.5, 1.5],
					opacity: [0, 0.6, 0],
					y: [0, -20, -40],
				}}
				transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
			/>
		</div>
	),
	ESCAPE: (
		<motion.div
			className="relative flex items-center justify-center w-24 h-24"
			initial={{ y: 0, opacity: 1, scale: 1 }}
			animate={{
				y: [0, -30, -60],
				opacity: [1, 0.8, 0],
				scale: [1, 1.1, 0.9],
			}}
			transition={{ duration: 0.8, ease: "easeOut" }}
		>
			<motion.div
				className="absolute w-16 h-16 rounded-full bg-white/40 filter blur-md shadow-[0_0_20px_rgba(255,255,255,0.8)]"
				initial={{ scale: 0.5, opacity: 0 }}
				animate={{
					scale: [0.5, 1.5, 2],
					opacity: [0, 1, 0],
				}}
				transition={{ duration: 0.6, ease: "easeOut" }}
			/>
			<div className="z-10 text-white text-sm font-bold tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
				ESCAPED
			</div>
		</motion.div>
	),
};

export function VfxOverlay({ vfx, onComplete }: VfxOverlayProps) {
	useEffect(() => {
		if (!vfx || isProjectile(vfx.type)) return;
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
			{type && VfxMapping[type]}
		</motion.div>
	);
}
