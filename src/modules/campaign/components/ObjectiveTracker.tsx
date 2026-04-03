"use client";

import { useBattleStore } from "@/modules/battle/store/battle.store";
import { ENCOUNTER_DB } from "@/modules/campaign/data/encounters.data";
import { useShallow } from "zustand/shallow";

export function ObjectiveTracker() {
	const { objectiveProgress, encounterId } = useBattleStore(
		useShallow((state) => ({
			objectiveProgress: state.objectiveProgress || {},
			encounterId: state.encounterId,
		})),
	);

	if (!encounterId) return null;

	const encounter = ENCOUNTER_DB[encounterId];
	if (!encounter) return null;

	const currentObjectiveText = encounter.objectiveText
		? encounter.objectiveText(objectiveProgress)
		: null;

	return (
		<div className="flex flex-col items-center pointer-events-none w-90 m-auto">
			{/* The Story/Lore Banner */}
			{encounter.flavorText && (
				<div className="text-gray-300 italic text-xs text-center bg-black/70 px-4 py-2 rounded-t-md border-b border-gray-700 w-full shadow-md">
					"{encounter.flavorText}"
				</div>
			)}

			{/* The Mechanical Objective */}
			<div className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-b-md shadow-md flex items-center justify-between w-full">
				<span className="text-amber-500 font-bold tracking-wider text-sm uppercase drop-shadow-md">
					{encounter.name}
				</span>

				{/* Render the dynamically formatted string directly */}
				{currentObjectiveText && (
					<div className="text-white font-mono text-xs font-bold bg-black/40 px-3 py-1 rounded border border-slate-600">
						{currentObjectiveText}
					</div>
				)}
			</div>
		</div>
	);
}
