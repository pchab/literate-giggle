"use client";

import { m } from "motion/react";
import { useEffect, useState } from "react";
import type { Card } from "@/modules/cards/domain/cards.type";
import { getComputedCard } from "@/modules/cards/helpers/cards.helper";
import { CLASS_REGISTRY } from "@/modules/figures/data/heroClass.data";
import type { Hero } from "@/modules/figures/domain/figures.type";
import type { RuneDraftOption } from "@/modules/figures/domain/heroClass.types";
import { generateDynamicRuneChoices } from "@/modules/figures/helpers/draft.helper";
import { RetroPanel } from "@/modules/shared/components/RetroPanel";
import ChooseCard from "./steps/ChooseCard";
import ChooseRune from "./steps/ChooseRune";
import XpReward from "./steps/XpReward";

export default function HeroRewardPanel({
	hero,
	xpEarned,
	index,
	onDraftComplete,
}: {
	hero: Hero;
	xpEarned: number;
	index: number;
	onDraftComplete: (
		drafts: { rune: RuneDraftOption; cardInstanceId: string }[],
	) => void;
}) {
	const classDef = CLASS_REGISTRY[hero.heroClass];

	// --- 1. Calculate Multi-Level Math ---
	let tempXp = hero.currentXp + xpEarned;
	let simulatedLevel = hero.currentLevel;
	const powerRuneQueue: { choices: RuneDraftOption[] }[] = [];

	while (
		classDef.xpThresholds[simulatedLevel] !== undefined &&
		tempXp >= classDef.xpThresholds[simulatedLevel]
	) {
		tempXp -= classDef.xpThresholds[simulatedLevel];

		const runeTrigger = classDef.levelUpTriggers[simulatedLevel]?.find(
			(t) => t.type === "powerRune",
		);
		if (runeTrigger) {
			const choices = generateDynamicRuneChoices(hero);
			powerRuneQueue.push({ choices });
		}
		simulatedLevel++;
	}

	const levelsGained = simulatedLevel - hero.currentLevel;
	const isLevelUp = levelsGained > 0;

	// --- 2. State Machine ---
	const [step, setStep] = useState<"xp" | "chooseRune" | "chooseCard" | "done">(
		"xp",
	);
	const [selectedRune, setSelectedRune] = useState<RuneDraftOption | null>(
		null,
	);
	const [completedDrafts, setCompletedDrafts] = useState<
		{ rune: RuneDraftOption; cardInstanceId: string }[]
	>([]);

	// --- 3. Auto-Advance ---
	useEffect(() => {
		if (isLevelUp && powerRuneQueue.length > 0) {
			const timer = setTimeout(() => setStep("chooseRune"), 2500);
			return () => clearTimeout(timer);
		} else {
			onDraftComplete([]);
		}
	}, [isLevelUp, powerRuneQueue.length, onDraftComplete]);

	// --- 4. Handle completing a single draft ---
	const [currentDraftIndex, setCurrentDraftIndex] = useState(0);
	const handleCardChosen = (cardId: string) => {
		if (!selectedRune) return;

		const newDrafts = [
			...completedDrafts,
			{ rune: selectedRune, cardInstanceId: cardId },
		];
		setCompletedDrafts(newDrafts);

		if (currentDraftIndex + 1 < powerRuneQueue.length) {
			setCurrentDraftIndex((prev) => prev + 1);
			setSelectedRune(null);
			setStep("chooseRune");
		} else {
			setStep("done");
			onDraftComplete(newDrafts);
		}
	};

	const computedDeck = hero.deck.map(getComputedCard);

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.4, delay: index * 0.1 }}
			className="flex-1 min-w-75"
		>
			<RetroPanel
				title={hero.name}
				className="h-full relative min-h-60 flex flex-col"
			>
				{/* STEP 1: Default XP Bar */}
				{step === "xp" && (
					<XpReward
						hero={hero}
						xpEarned={xpEarned}
						levelsGained={levelsGained}
						index={index}
						isLevelUp={isLevelUp}
					/>
				)}

				{/* STEP 2: Choose Rune */}
				{step === "chooseRune" && (
					<ChooseRune
						hero={hero}
						deck={computedDeck}
						powerRuneQueue={powerRuneQueue}
						index={currentDraftIndex}
						handleChooseRune={(rune: RuneDraftOption) => {
							setSelectedRune(rune);
							setStep("chooseCard");
						}}
					/>
				)}

				{/* STEP 3: Choose Card */}
				{step === "chooseCard" && selectedRune && (
					<ChooseCard
						deck={computedDeck}
						selectedRune={selectedRune}
						goBack={() => setStep("chooseRune")}
						handleChooseCard={(card: Card) => handleCardChosen(card.id)}
					/>
				)}

				{/* STEP 4: Done */}
				{step === "done" && (
					<m.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="flex flex-col items-center justify-center h-full pt-4 text-center"
					>
						<span className="text-4xl mb-2">✨</span>
						<span className="text-sm font-bold text-emerald-400 uppercase">
							{powerRuneQueue.length > 1
								? "Upgrades Applied!"
								: "Upgrade Applied!"}
						</span>
						<span className="text-xs text-slate-400 mt-1">
							Forging complete.
						</span>
					</m.div>
				)}
			</RetroPanel>
		</m.div>
	);
}
