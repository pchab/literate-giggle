import { motion } from "framer-motion";

export default function HealthBar({
	currentHp,
	maxHp,
	currentPhysBlock = 0,
	currentMagBlock = 0,
}: {
	currentHp: number;
	maxHp: number;
	currentPhysBlock?: number;
	currentMagBlock?: number;
}) {
	const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

	return (
		<div className="absolute -bottom-2 w-14 flex flex-col items-center pointer-events-none z-20">
			<div className="w-full h-1.5 bg-zinc-950 border border-zinc-700/80 rounded-sm overflow-hidden shadow-lg relative">
				<motion.div
					className="h-full bg-red-600 origin-left"
					initial={{ width: `${hpPercent}%` }}
					animate={{ width: `${hpPercent}%` }}
					transition={{ type: "spring", bounce: 0, duration: 0.5 }}
				/>
			</div>

			<span className="text-[9px] font-bold text-zinc-300 mt-[1px] drop-shadow-md">
				{currentHp}/{maxHp} {currentPhysBlock > 0 && `🛡️ ${currentPhysBlock}`}{" "}
				{currentMagBlock > 0 && `🔮 ${currentMagBlock}`}
			</span>
		</div>
	);
}
