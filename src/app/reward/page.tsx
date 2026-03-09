"use client";

import { domAnimation, LazyMotion, m } from "motion/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import { ENCOUNTER_DB } from "@/modules/campaign/data/encounters.data";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type { RuneDraftOption } from "@/modules/figures/domain/heroClass.types";
import { RetroButton } from "@/modules/shared/components/RetroButton";
import { WorldMapNodes } from "@/modules/world/data/mapNodes.data";
import { useWorldStore } from "@/modules/world/store/world.store";
import HeroRewardPanel from "./HeroRewardPanel";

export default function RewardScreen() {
	const { roster, claimRewards, phase, setPhase, currentNodeId } =
		useWorldStore(
			useShallow((state) => ({
				roster: state.roster,
				claimRewards: state.claimRewards,
				phase: state.phase,
				setPhase: state.setPhase,
				currentNodeId: state.currentNodeId,
			})),
		);

	const { encounterId, xpEarned, resetXpEarned } = useBattleStore(
		useShallow((state) => ({
			encounterId: state.encounterId,
			xpEarned: state.xpEarned,
			resetXpEarned: state.resetXpEarned,
		})),
	);

	const { getOverride, setActiveSceneId } = useCampaignStore(
		useShallow((state) => ({
			getOverride: state.getOverride,
			setActiveSceneId: state.setActiveSceneId,
		})),
	);

	const [initialRoster] = useState(roster);

	// Track which heroes have finished their drafts
	const [completedDrafts, setCompletedDrafts] = useState<
		Record<
			Hero["id"],
			{ rune: RuneDraftOption; cardInstanceId: Card["id"] } | null
		>
	>({});

	const sceneIdFromEncounter = encounterId
		? ENCOUNTER_DB[encounterId]?.onWinSceneId
		: null;
	const sceneId = sceneIdFromEncounter ?? getOverride(currentNodeId, "onWin");

	if (phase !== "REWARD") redirect("/");
	if (xpEarned === 0 || initialRoster.length === 0) {
		setPhase(WorldMapNodes[currentNodeId].type === "TOWN" ? "TOWN" : "MAP");
	}

	// Check if ALL heroes have reported back (either drafted successfully, or reported null because they didn't need to draft)
	const isReadyToClaim = initialRoster.every(
		(h) => completedDrafts[h.id] !== undefined,
	);

	const handleClaimAndReturn = () => {
		if (!isReadyToClaim) return;

		// We pass the drafted runes into the claim action so the store can apply them
		claimRewards(xpEarned, completedDrafts);
		resetXpEarned();

		if (sceneId) {
			setPhase("SCENE");
			setActiveSceneId(sceneId);
		}
	};

	return (
		<LazyMotion features={domAnimation}>
			<div className="min-h-screen w-screen bg-zinc-950 text-slate-300 p-8 flex flex-col items-center justify-center overflow-hidden">
				<m.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12"
				>
					<h1 className="text-5xl md:text-7xl font-pixel text-yellow-400 tracking-widest uppercase text-shadow-pixel">
						Victory
					</h1>
					<p className="text-slate-400 mt-2 tracking-widest text-sm uppercase font-bold">
						Party Experience Gained
					</p>
				</m.div>

				<div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 justify-center">
					{initialRoster.map((hero, index) => (
						<HeroRewardPanel
							key={hero.id}
							hero={hero}
							xpEarned={xpEarned}
							index={index}
							onDraftComplete={(draft) =>
								setCompletedDrafts((prev) => ({ ...prev, [hero.id]: draft }))
							}
						/>
					))}
				</div>

				<m.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.5 }}
					className="mt-12"
				>
					<RetroButton
						onClick={handleClaimAndReturn}
						variant="primary"
						disabled={!isReadyToClaim}
					>
						{isReadyToClaim ? "CLAIM & RETURN" : "AWAITING UPGRADES..."}
					</RetroButton>
				</m.div>
			</div>
		</LazyMotion>
	);
}
