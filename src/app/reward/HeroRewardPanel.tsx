"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { getComputedCard } from "@/modules/cards/helpers/cards.helper";
import { RetroPanel } from "@/modules/shared/components/RetroPanel";
import { HeroAvatar } from "@/modules/units/components/HeroSummary";
import { CLASS_REGISTRY } from "@/modules/units/data/heroClass.data";
import {
	EMPTY_DRAFT_RESULT,
	type HeroDraftResult,
	type RuneDraftOption,
} from "@/modules/units/domain/heroClass.types";
import type { Hero } from "@/modules/units/domain/units.type";
import {
	applyDraftResult,
	buildDraftSteps,
} from "@/modules/units/helpers/draft.helper";
import { isCardCompatibleWithRune } from "./runeReward.helpers";
import ChooseCard from "./steps/ChooseCard";
import ChooseNewCard from "./steps/ChooseNewCard";
import ChoosePassive from "./steps/ChoosePassive";
import ChooseRune from "./steps/ChooseRune";
import DraftSummary from "./steps/DraftSummary";
import XpReward from "./steps/XpReward";

export default function HeroRewardPanel({
	hero,
	xpEarned,
	index,
	onDraftComplete,
	onDraftReset,
}: {
	hero: Hero;
	xpEarned: number;
	index: number;
	onDraftComplete: (draft: HeroDraftResult) => void;
	onDraftReset: () => void;
}) {
	const classDef = CLASS_REGISTRY[hero.heroClass];

	// Computed once: rune choices must not re-roll on re-render.
	const [{ steps, levelsGained }] = useState(() =>
		buildDraftSteps(hero, xpEarned),
	);
	const [phase, setPhase] = useState<"xp" | "draft" | "done">("xp");
	const [stepIndex, setStepIndex] = useState(0);
	const [result, setResult] = useState<HeroDraftResult>(EMPTY_DRAFT_RESULT);
	const [pendingRune, setPendingRune] = useState<RuneDraftOption | null>(null);
	const reported = useRef(false);

	// The hero as it will look with the picks so far: every step shows this.
	const workingHero = applyDraftResult(hero, result);
	const step = steps[stepIndex];

	useEffect(() => {
		if (steps.length === 0) {
			if (!reported.current) {
				reported.current = true;
				onDraftComplete(EMPTY_DRAFT_RESULT);
			}
			return;
		}
		// Functional update: re-runs of this effect (new onDraftComplete each parent
		// render) must not drag a finished panel back to the draft step.
		const timer = setTimeout(
			() => setPhase((p) => (p === "xp" ? "draft" : p)),
			2500,
		);
		return () => clearTimeout(timer);
	}, [steps.length, onDraftComplete]);

	const commit = (next: HeroDraftResult) => {
		setResult(next);
		setPendingRune(null);
		if (stepIndex + 1 < steps.length) {
			setStepIndex((i) => i + 1);
		} else {
			setPhase("done");
			onDraftComplete(next);
		}
	};

	const redo = () => {
		setResult(EMPTY_DRAFT_RESULT);
		setPendingRune(null);
		setStepIndex(0);
		setPhase("draft");
		onDraftReset();
	};

	const hasPicks =
		result.runes.length + result.cards.length + result.passives.length > 0;

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.4, delay: index * 0.1 }}
			className="flex-1 min-w-75"
		>
			<RetroPanel
				title={hero.name}
				className="h-full relative min-h-60 flex flex-col gap-3"
			>
				{/* Identity: always know whose rewards these are */}
				<div className="flex items-center gap-3 pt-1">
					<HeroAvatar hero={workingHero} size={44} />
					<div className="flex flex-col">
						<span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
							{classDef.name} · Lv.{hero.currentLevel}
							{levelsGained > 0 && (
								<span className="text-yellow-300">
									{" "}
									→ {hero.currentLevel + levelsGained}
								</span>
							)}
						</span>
						{steps.length > 0 && (
							<span className="text-[10px] text-zinc-400 uppercase tracking-wider">
								{steps.length} choice{steps.length > 1 ? "s" : ""} to make
							</span>
						)}
					</div>
				</div>

				{phase === "xp" && (
					<XpReward
						hero={hero}
						xpEarned={xpEarned}
						levelsGained={levelsGained}
						index={index}
						isLevelUp={levelsGained > 0}
					/>
				)}

				{phase === "draft" && step && (
					<div className="flex flex-col gap-3">
						{/* Progress */}
						<div className="flex items-center justify-between">
							<span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
								Level {step.level} · choice {stepIndex + 1}/{steps.length}
							</span>
							<div className="flex gap-1">
								{steps.map((s, i) => (
									<span
										key={`${s.kind}-${i}`}
										className={`w-2 h-2 rounded-full ${i < stepIndex ? "bg-emerald-500" : i === stepIndex ? "bg-amber-400 animate-pulse" : "bg-zinc-700"}`}
									/>
								))}
							</div>
						</div>

						<AnimatePresence mode="wait">
							{step.kind === "rune" && !pendingRune && (
								<ChooseRune
									key={`rune-${stepIndex}`}
									hero={workingHero}
									choices={step.choices}
									handleChooseRune={(rune) => {
										const targets = workingHero.deck.filter((c) =>
											isCardCompatibleWithRune(getComputedCard(c), rune),
										);
										if (targets.length === 1) {
											commit({
												...result,
												runes: [
													...result.runes,
													{ rune, cardInstanceId: targets[0].instanceId },
												],
											});
										} else {
											setPendingRune(rune);
										}
									}}
								/>
							)}
							{step.kind === "rune" && pendingRune && (
								<ChooseCard
									key={`rune-card-${stepIndex}`}
									hero={workingHero}
									selectedRune={pendingRune}
									goBack={() => setPendingRune(null)}
									handleChooseCard={(cardInstanceId) =>
										commit({
											...result,
											runes: [
												...result.runes,
												{ rune: pendingRune, cardInstanceId },
											],
										})
									}
								/>
							)}
							{step.kind === "card" && (
								<ChooseNewCard
									key={`card-${stepIndex}`}
									hero={workingHero}
									options={step.options}
									handleChoose={(cardId) =>
										commit({ ...result, cards: [...result.cards, cardId] })
									}
								/>
							)}
							{step.kind === "passive" && (
								<ChoosePassive
									key={`passive-${stepIndex}`}
									options={step.options}
									handleChoose={(passiveId) =>
										commit({
											...result,
											passives: [...result.passives, passiveId],
										})
									}
								/>
							)}
						</AnimatePresence>

						{hasPicks && (
							<DraftSummary hero={workingHero} result={result} compact />
						)}
					</div>
				)}

				{phase === "done" && (
					<m.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="flex flex-col gap-3"
					>
						<span className="text-sm font-bold text-emerald-400 uppercase text-center">
							✨ Ready to claim
						</span>
						<DraftSummary hero={workingHero} result={result} />
						<button
							type="button"
							onClick={redo}
							className="self-center text-[10px] text-zinc-500 hover:text-zinc-300 uppercase underline"
						>
							Redo choices
						</button>
					</m.div>
				)}
			</RetroPanel>
		</m.div>
	);
}
