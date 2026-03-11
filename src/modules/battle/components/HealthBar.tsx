import { motion } from "framer-motion";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { getBlockFromStatuses } from "@/modules/figures/helpers/figures.helpers";

export default function HealthBar({
	currentHp,
	maxHp,
	statuses = [],
}: {
	currentHp: BattleUnit["currentHp"];
	maxHp: BattleUnit["maxHp"];
	statuses?: BattleUnit["statuses"];
}) {
	const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
	const currentBlock = getBlockFromStatuses(statuses);
	const currentPoison = statuses.find((s) => s.type === "poison")?.amount ?? 0;

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

			<span className="text-[9px] font-bold text-zinc-300 mt-px drop-shadow-md flex items-center justify-center gap-1">
				<span>
					{currentHp}/{maxHp}
				</span>
				{currentBlock > 0 && (
					<span className="text-blue-300">🛡️{currentBlock}</span>
				)}
				{currentPoison > 0 && (
					<span className="text-purple-400">☠️{currentPoison}</span>
				)}
			</span>
		</div>
	);
}
