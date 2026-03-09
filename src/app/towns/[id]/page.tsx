"use client";

import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { QUEST_DB } from "@/modules/campaign/data/quests.data";
import type { Quest } from "@/modules/campaign/domain/quests.type";
import type { Scene } from "@/modules/campaign/domain/scenes.type";
import { useCheckConditions } from "@/modules/campaign/hooks/useCheckConditions.hook";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { ForgeScreen } from "@/modules/towns/components/ForgeScreen";
import { TOWN_DB } from "@/modules/towns/data/towns.data";
import type { TownData, TownLocation } from "@/modules/towns/domain/towns.type";
import { useWorldStore } from "@/modules/world/store/world.store";

export default function TownPage() {
	const params = useParams();
	const { activeQuests, setActiveSceneId } = useCampaignStore(
		useShallow((state) => ({
			activeQuests: state.activeQuests,
			setActiveSceneId: state.setActiveSceneId,
			flags: state.flags,
		})),
	);
	const { healParty, phase, setPhase } = useWorldStore(
		useShallow((state) => ({
			healParty: state.healParty,
			phase: state.phase,
			setPhase: state.setPhase,
		})),
	);
	const isConditionMet = useCheckConditions();
	const [isForgeOpen, setIsForgeOpen] = useState(false);

	if (phase !== "TOWN") {
		return redirect("/");
	}

	const townId = params.id as TownData["id"];
	const town = TOWN_DB[townId];

	if (!town) {
		return (
			<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
				Town not found.
			</div>
		);
	}

	const visibleLocations = town.locations.filter((loc) => {
		// 1. Check if it should be hidden
		if (loc.hideCondition) {
			const shouldHide = loc.hideCondition.some((cond) => isConditionMet(cond));
			if (shouldHide) return false;
		}

		// 2. Check if it is unlocked
		if (loc.unlockCondition) {
			const isUnlocked = loc.unlockCondition.every((cond) =>
				isConditionMet(cond),
			);
			if (!isUnlocked) return false;
		}

		return true;
	});

	const getQuestForLocation = (locationId: TownLocation["id"]) => {
		for (const [qId, stepId] of Object.entries(activeQuests)) {
			const quest = QUEST_DB[qId as Quest["id"]];
			if (!quest) continue;
			const activeStepIds = Array.isArray(stepId) ? stepId : [stepId];
			for (const sId of activeStepIds) {
				const step = quest.steps[sId];
				if (
					step.targetNodeId.map((node) => node.locationId).includes(locationId)
				)
					return step;
			}
		}
		return null;
	};

	const loadScene = (sceneId: Scene["id"]) => {
		setPhase("SCENE");
		setActiveSceneId(sceneId);
		setTimeout(() => redirect("/"), 300);
	};

	const handleLocationClick = (location: TownLocation) => {
		const activeQuestStep = getQuestForLocation(location.id);

		if (activeQuestStep?.onEnterSceneId) {
			return loadScene(activeQuestStep.onEnterSceneId);
		}

		switch (location.type) {
			case "SCENE":
				if (location.defaultSceneId) {
					loadScene(location.defaultSceneId);
				}
				break;
			case "HEAL":
				healParty(10);
				alert("The party rests at the Inn. HP fully restored!");
				break;
			case "FORGE":
				setIsForgeOpen(true);
				break;
		}
	};

	if (isForgeOpen) {
		return <ForgeScreen onClose={() => setIsForgeOpen(false)} />;
	}

	return (
		<div className="w-full h-screen bg-zinc-950 relative overflow-hidden flex items-center justify-center">
			{/* Top Bar for Nav and Gold */}
			<div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
				<button
					type="button"
					onClick={() => setPhase("MAP")}
					className="pointer-events-auto px-6 py-3 bg-zinc-900/90 border border-zinc-700 hover:border-amber-500 text-zinc-300 rounded uppercase tracking-widest text-sm transition-all"
				>
					Return to Map
				</button>
			</div>

			{/* The Interactive Map Container */}
			<div className="relative w-full aspect-video shadow-2xl border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900">
				{/* Town Background Image */}
				<Image
					src={town.backgroundImage}
					alt={town.name}
					fill
					className="absolute inset-0 w-full h-full object-cover opacity-80"
				/>

				{/* Town Title Overlay */}
				<div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none drop-shadow-md">
					<h1 className="text-4xl text-amber-500 font-serif tracking-widest uppercase">
						{town.name}
					</h1>
				</div>

				{/* Render the Location Pins */}
				{visibleLocations.map((location) => {
					const hasQuest = !!getQuestForLocation(location.id);

					return (
						<div
							key={location.id}
							className="absolute group z-10"
							style={{
								left: `${location.position.x}%`,
								top: `${location.position.y}%`,
								transform: "translate(-50%, -50%)", // Center the pin on the exact coordinate
							}}
						>
							{/* Quest Indicator */}
							{hasQuest && (
								<div className="absolute -top-10 left-1/2 -translate-x-1/2 text-amber-500 font-bold text-3xl animate-bounce drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
									!
								</div>
							)}

							{/* The Interactive Pin */}
							<button
								type="button"
								onClick={() => handleLocationClick(location)}
								className="w-6 h-6 bg-zinc-800 border-2 border-zinc-400 rounded-full hover:border-amber-500 hover:bg-amber-900 transition-all hover:scale-125 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
							/>

							{/* Hover Tooltip */}
							<div className="absolute top-8 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-zinc-950/90 border border-zinc-700 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex flex-col items-center">
								<span className="text-sm text-zinc-100 font-medium">
									{location.name}
								</span>
								<span className="text-[10px] text-zinc-500 uppercase tracking-widest">
									{location.type}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
