import { useShallow } from "zustand/shallow";
import { QUEST_DB } from "@/modules/campaign/data/quests.data";
import type { Quest } from "@/modules/campaign/domain/quests.type";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";

export function QuestTracker() {
	const { activeQuests, completedQuests } = useCampaignStore(
		useShallow((state) => ({
			activeQuests: state.activeQuests,
			completedQuests: state.completedQuests,
		})),
	);

	const activeQuestEntries = Object.entries(activeQuests);

	return (
		<div className="flex flex-col h-full bg-zinc-950 p-8 custom-scrollbar overflow-y-auto">
			<h2 className="text-4xl font-pixel tracking-widest text-shadow-pixel text-amber-500 uppercase mb-8">
				Active Quests
			</h2>

			{activeQuestEntries.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-64 border-4 border-dashed border-zinc-800 bg-zinc-900/50">
					<span className="text-zinc-500 font-pixel text-xl uppercase tracking-widest">
						No active quests
					</span>
					<span className="text-zinc-600 text-sm mt-2 font-serif">
						Explore the world to find new adventures.
					</span>
				</div>
			) : (
				<div className="flex flex-col gap-6">
					{activeQuestEntries.map(([questId, stepId]) => {
						const quest = QUEST_DB[questId as Quest["id"]];
						const step = quest?.steps[stepId];

						if (!quest || !step) return null;

						return (
							<div
								key={questId}
								className="relative bg-zinc-900 border-2 border-zinc-700 p-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
							>
								{/* Decorative Corner Pin */}
								<div className="absolute top-2 left-2 w-2 h-2 bg-zinc-600 border border-zinc-950 rounded-full shadow-sm" />

								<h3 className="text-2xl font-pixel text-zinc-200 tracking-wide uppercase mb-2">
									{quest.title}
								</h3>
								<p className="text-zinc-400 italic font-serif mb-4 text-sm border-b border-zinc-800 pb-4">
									{quest.loreDescription}
								</p>

								<div className="flex items-start gap-3 bg-zinc-950 p-4 border border-zinc-800">
									<span className="text-amber-500 animate-pulse mt-0.5">❖</span>
									<p className="text-amber-100 font-bold tracking-wide">
										{step.logDescription}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Optional: Show Completed Quests */}
			{completedQuests.length > 0 && (
				<div className="mt-12 opacity-50">
					<h3 className="text-xl font-pixel text-zinc-500 tracking-widest uppercase mb-4">
						Completed
					</h3>
					<ul className="flex flex-col gap-2 list-disc list-inside text-zinc-400 font-serif">
						{completedQuests.map((questId) => (
							<li key={questId} className="line-through decoration-zinc-600">
								{QUEST_DB[questId]?.title || "Unknown Quest"}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
