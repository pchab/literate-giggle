import { PASSIVE_REGISTRY } from "@/modules/battle/data/passives.data";
import type { PassiveId } from "../data/passiveIds.data";

export function PassiveChip({
	passiveId,
	showDescription = false,
}: {
	passiveId: string;
	showDescription?: boolean;
}) {
	const passive = PASSIVE_REGISTRY[passiveId as PassiveId];
	if (!passive) return null;
	return (
		<span
			title={passive.description}
			className="text-[10px] bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/50 inline-flex flex-col cursor-help"
		>
			<span className="font-bold">
				{passive.icon} {passive.name}
			</span>
			{showDescription && (
				<span className="text-emerald-200/80 font-normal leading-snug">
					{passive.description}
				</span>
			)}
		</span>
	);
}
