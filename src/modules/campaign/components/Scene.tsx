"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import type { Scene } from "@/modules/campaign/domain/scenes.type";
import { useSceneEngine } from "@/modules/campaign/hooks/useSceneEngine.hook";
import { RetroButton } from "@/modules/shared/components/RetroButton";
import { getBackgroundImage } from "@/modules/shared/helpers/backgroundImage.helpers";
import { useWorldStore } from "@/modules/world/store/world.store";

export default function SceneComponent({ scene }: { scene: Scene }) {
	const [currentStepId, setCurrentStepId] = useState<string>(
		scene.initialStepId,
	);
	const { processActions } = useSceneEngine((newStepId) =>
		setCurrentStepId(newStepId),
	);
	const roster = useWorldStore(useShallow((state) => state.roster));

	if (!currentStepId) return null;

	const currentStep = scene.steps[currentStepId];
	if (!currentStep) return null;

	const backgroundImage = currentStep.backgroundImage
		? getBackgroundImage(currentStep.backgroundImage, 1200, 817)
		: "none";

	return (
		<>
			<AnimatePresence mode="wait">
				<motion.div
					key={currentStep.backgroundImage || "default-bg"}
					initial={{ opacity: 0, scale: 1.05 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1.5, ease: "easeInOut" }}
					className="absolute inset-0 bg-cover bg-center z-0"
					style={{
						backgroundImage,
					}}
				/>
			</AnimatePresence>

			{/* Dark Vignette Overlay for text readability */}
			<div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.9)_100%)] pointer-events-none" />
			<div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-zinc-950 via-zinc-950/10 to-transparent z-0 pointer-events-none" />

			{/* 2. CHOICES LAYER (Centered above dialogue) */}
			<div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col gap-4 mb-8">
				<AnimatePresence mode="wait">
					{currentStep.choices && currentStep.choices.length > 0 && (
						<motion.div
							key={`choices-${currentStepId}`}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ delay: 0.5 }}
							className="flex flex-col gap-4 items-center"
						>
							{currentStep.choices
								.filter(
									({ reqClass }) =>
										!reqClass ||
										roster.map(({ heroClass }) => heroClass).includes(reqClass),
								)
								.map((choice, idx) => (
									<RetroButton
										key={idx}
										variant="default"
										className="w-full max-w-md text-sm md:text-base py-3 border-zinc-500 hover:border-amber-400 hover:text-amber-400 bg-zinc-900/90 backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.8)]"
										onClick={() => processActions(choice.actions)}
									>
										{choice.label}
									</RetroButton>
								))}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* 3. DIALOGUE BOX LAYER */}
			<div className="relative z-10 w-full max-w-5xl mx-auto">
				<AnimatePresence mode="wait">
					<motion.div
						key={`dialogue-${currentStepId}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						className="relative bg-zinc-900/95 backdrop-blur-md border border-zinc-700 shadow-[0_10px_40px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,0.8)] rounded-sm p-6 md:p-10 min-h-40"
					>
						{/* Speaker Name Tag */}
						{currentStep.speaker && (
							<div className="absolute -top-6 left-6 bg-zinc-950 border border-zinc-600 px-6 py-2 shadow-[0_4px_0_rgba(0,0,0,1)] rounded-sm">
								<span className="font-pixel text-amber-500 tracking-widest text-shadow-pixel uppercase text-sm md:text-base">
									{currentStep.speaker}
								</span>
							</div>
						)}

						{/* Dialogue Text */}
						<p className="text-lg md:text-xl leading-relaxed text-zinc-300 font-serif drop-shadow-md">
							{currentStep.text}
						</p>

						{/* Standard "Next" Button (If there are no choices) */}
						{currentStep.onNext && !currentStep.choices && (
							<div className="absolute bottom-4 right-6">
								<button
									type="button"
									onClick={() =>
										currentStep.onNext && processActions(currentStep.onNext)
									}
									className="group flex items-center gap-2 text-zinc-500 hover:text-amber-400 font-pixel uppercase tracking-widest text-sm transition-colors"
								>
									<span>Next</span>
									<span className="text-xl group-hover:translate-x-1 transition-transform">
										➾
									</span>
								</button>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</>
	);
}
