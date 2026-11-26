"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import { ENCOUNTER_DB } from "@/modules/campaign/data/encounters.data";
import { SCENE_DB } from "@/modules/campaign/data/scenes.data";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { RetroButton } from "@/modules/shared/components/RetroButton";
import { HeroAvatar } from "@/modules/units/components/HeroSummary";
import { useDynamicMap } from "@/modules/world/hooks/useDynamicMap";
import { BATTERED_HP_RATIO } from "@/modules/world/store/commands/batterParty.command";
import { useWorldStore } from "@/modules/world/store/world.store";

/**
 * Losing a battle is a choice point:
 * - Try again: replay the same fight, party as it was before it.
 * - Retreat: back to the map or town, battered.
 * - Accept defeat (when the encounter has a lose scene): the story goes on, battered.
 */
export default function DefeatScreen() {
	const router = useRouter();
	const { encounterId, background } = useBattleStore(
		useShallow((s) => ({
			encounterId: s.encounterId,
			background: s.background,
		})),
	);
	const { phase, roster, setPhase, batterParty, currentNodeId } = useWorldStore(
		useShallow((s) => ({
			phase: s.phase,
			roster: s.roster,
			setPhase: s.setPhase,
			batterParty: s.batterParty,
			currentNodeId: s.currentNodeId,
		})),
	);
	const setActiveSceneId = useCampaignStore((s) => s.setActiveSceneId);
	const dynamicMap = useDynamicMap();

	useEffect(() => {
		if (phase !== "DEFEAT") router.replace("/");
	}, [phase, router]);

	const encounter = encounterId ? ENCOUNTER_DB[encounterId] : undefined;
	const loseSceneId = encounter?.onLoseSceneId;
	const hasLoseScene = !!loseSceneId && !!SCENE_DB[loseSceneId];

	const tryAgain = () => {
		if (!encounterId) return;
		setPhase("BATTLE");
		router.push(`/battle/${encounterId}?background=${background ?? ""}`);
	};

	const retreat = () => {
		batterParty();
		setPhase(dynamicMap[currentNodeId]?.type === "TOWN" ? "TOWN" : "MAP");
		router.push("/");
	};

	const acceptDefeat = () => {
		if (!loseSceneId) return;
		batterParty();
		setActiveSceneId(loseSceneId);
		setPhase("SCENE");
		router.push(`/scenes/${loseSceneId}`);
	};

	const battered = Math.round(BATTERED_HP_RATIO * 100);

	return (
		<main className="min-h-screen w-screen bg-zinc-950 text-zinc-300 flex flex-col items-center justify-center gap-10 p-8">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center"
			>
				<h1 className="text-5xl md:text-7xl font-pixel text-red-500 tracking-widest uppercase text-shadow-pixel">
					Defeat
				</h1>
				<p className="text-zinc-400 mt-3 tracking-widest text-sm uppercase font-bold">
					{encounter?.name ?? "The battle"} was too much… this time.
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
				className="flex gap-6"
			>
				{roster.map((hero) => (
					<div
						key={hero.id}
						className="flex flex-col items-center gap-2 grayscale-[60%]"
					>
						<HeroAvatar hero={hero} size={64} />
						<span className="font-pixel text-xs uppercase tracking-widest">
							{hero.name}
						</span>
					</div>
				))}
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8 }}
				className="flex flex-col md:flex-row gap-4 items-stretch"
			>
				<DefeatOption
					title="Try again"
					text="Replay the fight. Your heroes start as they were before it."
					onClick={tryAgain}
					disabled={!encounterId}
					variant="primary"
				/>
				{hasLoseScene && (
					<DefeatOption
						title="Accept defeat"
						text={`The story goes on without this victory. Heroes keep ${battered}% of their HP.`}
						onClick={acceptDefeat}
						variant="warning"
					/>
				)}
				<DefeatOption
					title="Retreat"
					text={`Fall back and come back later. Heroes keep ${battered}% of their HP.`}
					onClick={retreat}
				/>
			</motion.div>
		</main>
	);
}

function DefeatOption({
	title,
	text,
	onClick,
	disabled,
	variant = "default",
}: {
	title: string;
	text: string;
	onClick: () => void;
	disabled?: boolean;
	variant?: "default" | "primary" | "warning";
}) {
	return (
		<div className="flex flex-col items-center gap-3 w-64 bg-zinc-900/60 border border-zinc-800 rounded-md p-4 text-center">
			<RetroButton onClick={onClick} disabled={disabled} variant={variant}>
				{title}
			</RetroButton>
			<span className="text-xs text-zinc-400 leading-snug">{text}</span>
		</div>
	);
}
