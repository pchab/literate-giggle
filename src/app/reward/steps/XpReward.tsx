import { m } from "motion/react";
import { BattleCard } from "@/modules/cards/components/BattleCard";
import { getComputedCard } from "@/modules/cards/helpers/cards.helper";
import { CLASS_REGISTRY } from "@/modules/figures/data/heroClass.data";
import type { Hero } from "@/modules/figures/domain/figures.type";

export default function XpReward({
	hero,
	xpEarned,
	levelsGained,
	index,
	isLevelUp,
}: {
	hero: Hero;
	xpEarned: number;
	levelsGained: number;
	index: number;
	isLevelUp: boolean;
}) {
	const classDef = CLASS_REGISTRY[hero.heroClass];
	const primaryWeapon = hero.deck[0];

	const targetMaxXp = classDef.xpThresholds[hero.currentLevel] || 999;
	const startPercent = Math.min((hero.currentXp / targetMaxXp) * 100, 100);
	const endPercent = Math.min(
		((hero.currentXp + xpEarned) / targetMaxXp) * 100,
		100,
	);

	return (
		<m.div className="flex flex-col gap-6 pt-4" exit={{ opacity: 0, y: -10 }}>
			<div className="flex items-center gap-6">
				{primaryWeapon && (
					<div className="w-20 shrink-0 transform hover:scale-105 transition-transform">
						<BattleCard
							card={getComputedCard(primaryWeapon)}
							isPlayable={false}
						/>
					</div>
				)}
				<div className="flex-1 flex flex-col gap-2">
					<div className="flex justify-between items-end">
						<div className="flex flex-col">
							<span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">
								{classDef.name} Lv.{hero.currentLevel}{" "}
								{levelsGained > 1 && `(+${levelsGained}!)`}
							</span>
						</div>
						<span className="text-cyan-400 font-mono text-sm font-bold">
							+{xpEarned} XP
						</span>
					</div>
					<div className="h-4 w-full bg-slate-950 rounded border border-slate-700 relative overflow-hidden shadow-inner">
						<div
							className="absolute top-0 left-0 h-full bg-cyan-950"
							style={{ width: `${startPercent}%` }}
						/>
						<m.div
							className="absolute top-0 h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
							style={{ left: `${startPercent}%` }}
							initial={{ width: "0%" }}
							animate={{ width: `${endPercent - startPercent}%` }}
							transition={{
								duration: 1.2,
								delay: index * 0.2 + 0.5,
								ease: "easeOut",
							}}
						/>
					</div>
					<div className="flex justify-between items-center text-xs font-mono h-6">
						<span className="text-slate-500">
							{Math.min(hero.currentXp + xpEarned, targetMaxXp)} / {targetMaxXp}
						</span>
						{isLevelUp && (
							<m.span
								initial={{ opacity: 0, scale: 0.5, y: 10 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								transition={{ delay: 1.8, type: "spring" }}
								className="text-yellow-400 font-black uppercase tracking-widest animate-pulse"
							>
								Level Up!
							</m.span>
						)}
					</div>
				</div>
			</div>
		</m.div>
	);
}
