import { motion } from "motion/react";
import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { BattleUnit } from "@/modules/units/domain/units.type";

export default function HealthBar({ unitId }: { unitId: BattleUnit["id"] }) {
	// ==========================================
	// SMART SUBSCRIPTIONS
	// ==========================================
	const { units, projectedDamage, projectedHealing } = useBattleStore(
		useShallow((state) => ({
			units: state.units,
			projectedDamage:
				(state.aiStateDiff.projectedDamage[unitId] ?? 0) +
				(state.playerStateDiff.projectedDamage[unitId] ?? 0),
			projectedHealing:
				(state.aiStateDiff.projectedHealing[unitId] ?? 0) +
				(state.playerStateDiff.projectedHealing[unitId] ?? 0),
		})),
	);

	const unit = units.find((u) => u.id === unitId);
	if (!unit) return null;
	const { currentHp, maxHp, statuses = [], size = { cols: 1, rows: 1 } } = unit;

	// ==========================================
	// STATUS AGGREGATION
	// ==========================================
	const totalBlock = statuses
		.filter((s) => s.type === "block")
		.reduce((sum, s) => sum + s.amount, 0);

	const totalPoison = statuses
		.filter((s) => s.type === "poison")
		.reduce((sum, s) => sum + s.amount, 0);

	// ==========================================
	// HP PERCENTAGE MATH (Left to Right Visual Order)
	// ==========================================
	const dmgLoss = Math.min(currentHp, projectedDamage);
	const healGain = Math.min(maxHp - currentHp, projectedHealing);
	const netHp = currentHp - dmgLoss + healGain;

	// Poison eats from the very right edge of whatever the final HP is
	const poisonLoss = Math.min(netHp, totalPoison);

	// Calculate the safe segments
	const safeHp = Math.max(
		0,
		currentHp - dmgLoss - Math.max(0, poisonLoss - healGain),
	);
	const safeHeal = Math.max(0, healGain - poisonLoss);

	// Convert to percentages
	const safePercent = Math.max(0, (safeHp / maxHp) * 100);
	const healPercent = Math.max(0, (safeHeal / maxHp) * 100);
	const poisonPercent = Math.max(0, (poisonLoss / maxHp) * 100);
	const dmgPercent = Math.max(0, (dmgLoss / maxHp) * 100);

	const imminentDeath = safeHp <= 0 && currentHp > 0 && healGain === 0;

	return (
		<div
			className="absolute -bottom-2 flex flex-col items-center pointer-events-none z-20"
			style={{ width: `${size.rows * 3.5}rem` }}
		>
			<div className="w-full h-1.5 bg-zinc-950 border border-zinc-700/80 rounded-sm overflow-hidden shadow-lg relative flex">
				{/* 1. Safe Portion (Red) */}
				{safePercent > 0 && (
					<motion.div
						className="h-full bg-red-600 origin-left"
						initial={{ width: `${safePercent}%` }}
						animate={{ width: `${safePercent}%` }}
						transition={{ type: "spring", bounce: 0, duration: 0.5 }}
					/>
				)}

				{/* 2. Projected Healing Portion (Flashing Green) */}
				{healPercent > 0 && (
					<motion.div
						className="h-full bg-emerald-500 origin-left"
						initial={{ width: `${healPercent}%` }}
						animate={{ width: `${healPercent}%`, opacity: [0.6, 1, 0.6] }}
						transition={{
							width: { type: "spring", bounce: 0, duration: 0.5 },
							opacity: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
						}}
					/>
				)}

				{/* 3. Threatened Poison Portion (Purple) */}
				{poisonPercent > 0 && (
					<motion.div
						className={`h-full origin-left ${imminentDeath && dmgPercent === 0 ? "bg-purple-500" : "bg-purple-700/90"}`}
						initial={{ width: `${poisonPercent}%` }}
						animate={{ width: `${poisonPercent}%` }}
						transition={{ type: "spring", bounce: 0, duration: 0.5 }}
					/>
				)}

				{/* 4. Projected Damage Portion (Flashing Orange) */}
				{dmgPercent > 0 && (
					<motion.div
						className="h-full bg-orange-500 origin-left"
						initial={{ width: `${dmgPercent}%` }}
						animate={{ width: `${dmgPercent}%`, opacity: [1, 0.5, 1] }}
						transition={{
							width: { type: "spring", bounce: 0, duration: 0.5 },
							opacity: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
						}}
					/>
				)}
			</div>

			<span className="text-[9px] font-bold text-zinc-300 mt-px drop-shadow-md flex items-center justify-center gap-1">
				<span>
					{currentHp}/{maxHp}
				</span>
				{totalBlock > 0 && <span className="text-blue-300">🛡️{totalBlock}</span>}

				{/* Text Popups */}
				{projectedDamage > 0 && (
					<span className="text-orange-400">-{projectedDamage}</span>
				)}
				{projectedHealing > 0 && (
					<span className="text-emerald-400">+{healGain}</span>
				)}

				{totalPoison > 0 && (
					<span
						className={`flex items-center gap-0.5 ${
							totalPoison >= netHp ? "text-purple-300" : "text-purple-400"
						}`}
					>
						☠️{totalPoison}
					</span>
				)}
			</span>
		</div>
	);
}
