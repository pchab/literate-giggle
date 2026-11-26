import { m } from "motion/react";
import { PASSIVE_REGISTRY } from "@/modules/battle/data/passives.data";
import type { PassiveId } from "@/modules/units/data/passiveIds.data";

export default function ChoosePassive({
	options,
	handleChoose,
}: {
	options: string[];
	handleChoose: (passiveId: string) => void;
}) {
	return (
		<m.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="flex flex-col gap-3"
		>
			<span className="text-xs font-bold text-yellow-400 uppercase">
				Choose a passive
			</span>
			<div className="flex flex-col gap-2">
				{options.map((id) => {
					const passive = PASSIVE_REGISTRY[id as PassiveId];
					if (!passive) return null;
					return (
						<button
							type="button"
							key={id}
							onClick={() => handleChoose(id)}
							className="text-left border border-emerald-900 bg-emerald-950/30 hover:bg-emerald-900/40 hover:border-emerald-600 rounded p-2 transition-colors flex flex-col gap-0.5"
						>
							<span className="text-sm font-bold text-emerald-300">
								{passive.icon} {passive.name}
							</span>
							<span className="text-[11px] text-emerald-100/70 leading-snug">
								{passive.description}
							</span>
						</button>
					);
				})}
			</div>
		</m.div>
	);
}
