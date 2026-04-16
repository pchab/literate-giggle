"use client";

import { BattleGrid } from "@/modules/battle/components/BattleGrid";
import { emptyStateDiff } from "@/modules/battle/domain/intent.type";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import { MotionCamera } from "@/modules/shared/components/MotionCamera";
import { getBackgroundImage } from "@/modules/shared/helpers/backgroundImage.helpers";
import { UnitPropertyForm } from "@/modules/unit-editor/components/UnitPropertyForm";
import { useUnitEditorStore } from "@/modules/unit-editor/store/unitEditor.store";
import { UnitStance } from "@/modules/units/domain/units.type";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export default function UnitEditorPage() {
	const { draftUnit } = useUnitEditorStore();

	// Local state for the diorama controls
	const [previewStance, setPreviewStance] = useState<UnitStance>(
		UnitStance.IDLE,
	);
	const [previewIntent, setPreviewIntent] = useState<Card["id"] | null>(null);

	const { initUnitEditorTestBattle, calculateAIIntents } = useBattleStore(
		useShallow((state) => ({
			initUnitEditorTestBattle: state.initUnitEditorTestBattle,
			calculateAIIntents: state.calculateAIIntents, // Ensure this is exposed in your store!
		})),
	);

	const backgroundImage = getBackgroundImage(
		"/battlegrounds/grass_3_2.webp",
		800,
		800,
	);

	// 1. DIORAMA INITIALIZATION (Only fires when the Unit or Stance changes)
	useEffect(() => {
		const timer = setTimeout(() => {
			initUnitEditorTestBattle(draftUnit, previewStance);

			if (previewIntent) {
				calculateAIIntents({
					[draftUnit.id]: { cardId: previewIntent, unitId: draftUnit.id },
				});
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [
		draftUnit,
		previewStance,
		initUnitEditorTestBattle,
		calculateAIIntents,
		previewIntent,
	]);

	// Clean up on exit
	useEffect(() => {
		return () => {
			useBattleStore.setState({
				battleStatus: "VICTORY",
				units: [],
				encounterId: null,
			});
		};
	}, []);

	return (
		<div className="flex h-screen w-full bg-zinc-950 overflow-hidden">
			{/* LEFT PANE: Form */}
			<div className="h-full z-10 shrink-0 w-125">
				<UnitPropertyForm />
			</div>
			<div className="flex-1 relative flex flex-col items-center justify-start p-8 overflow-y-auto">
				{/* Diorama Controls */}
				<div className="flex gap-4 mb-6 bg-zinc-900 p-4 rounded-lg border border-zinc-700 shadow-xl z-20">
					<div className="flex flex-col">
						<span className="text-xs font-bold text-zinc-400 mb-1">
							Preview Stance
						</span>
						<select
							value={previewStance}
							onChange={(e) =>
								setPreviewStance(Number(e.target.value) as UnitStance)
							}
							className="bg-zinc-800 text-sm rounded border border-zinc-600 px-3 py-1.5 text-zinc-200"
						>
							<option value={UnitStance.IDLE}>Idle</option>
							<option value={UnitStance.MOVING}>Moving</option>
							<option value={UnitStance.ATTACKING}>Attacking</option>
						</select>
					</div>

					<div className="flex flex-col">
						<span className="text-xs font-bold text-zinc-400 mb-1">
							Preview Intent
						</span>
						<select
							value={previewIntent || ""}
							onChange={(e) => {
								const newIntent = (e.target.value as Card["id"]) || null;
								setPreviewIntent(newIntent); // 1. Update the local UI state

								// 2. Talk to the engine immediately in the event handler!
								if (newIntent) {
									calculateAIIntents({
										[draftUnit.id]: { cardId: newIntent, unitId: draftUnit.id },
									});
								} else {
									useBattleStore.setState({
										aiIntents: {},
										aiStateDiff: emptyStateDiff,
									});
								}
							}}
							className="bg-zinc-800 text-sm rounded border border-zinc-600 px-3 py-1.5 text-blue-300 font-mono"
						>
							<option value="">None</option>
							{draftUnit.intentPool.map((intent) => (
								<option key={intent.cardId} value={intent.cardId}>
									{intent.cardId || "(empty)"}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* The 5x5 Diorama */}
				<MotionCamera background={backgroundImage}>
					<BattleGrid />
				</MotionCamera>

				<div className="absolute top-4 right-4 px-3 py-1 bg-purple-600/80 text-white text-xs font-bold uppercase tracking-wider rounded backdrop-blur-sm z-50 pointer-events-none">
					Unit Diorama
				</div>
			</div>
		</div>
	);
}
