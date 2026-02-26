"use client";

import { motion } from "motion/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { HeroPortrait } from "@/components/HeroPortrait";
import { useWorldStore } from "@/store/world.store";

export default function CampScreen() {
	const { setPhase, roster, phase } = useWorldStore(
		useShallow((state) => ({
			setPhase: state.setPhase,
			roster: state.roster,
			phase: state.phase,
		})),
	);

	useEffect(() => {
		if (phase !== "CAMP") {
			redirect("/");
		}
	}, [phase]);

	const handleRest = () => {
		// Here you would call an action like `healParty(10)`
		alert("The party rests by the fire. (Heal Logic Here)");
		setPhase("MAP");
	};

	const handleTrain = () => {
		// Here you could open a mini-deckbuilder to spend XP and trigger `evolveCard`
		alert("Training dummy activated! (Upgrade Logic Here)");
	};

	return (
		<div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 relative overflow-hidden">
			{/* Dark vignette background */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#27272a_0%,_#09090b_80%)] opacity-50 z-0" />

			<div className="z-10 flex flex-col items-center">
				<h1 className="text-4xl font-black text-amber-500 tracking-widest uppercase mb-2 drop-shadow-md">
					Campfire
				</h1>
				<p className="text-zinc-400 mb-12 italic text-sm">
					A brief moment of respite in a hostile world.
				</p>

				{/* Animated Campfire placeholder */}
				<motion.div
					className="w-24 h-24 mb-12 flex items-center justify-center text-6xl drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]"
					animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
					transition={{ duration: 2, repeat: Infinity }}
				>
					🔥
				</motion.div>

				{/* The Party */}
				<div className="flex gap-6 mb-12">
					{roster.map((hero) => (
						<div key={hero.id} className="flex flex-col items-center">
							<HeroPortrait classType={hero.heroClass} />
							<span className="text-xs font-bold mt-2 text-zinc-400">
								{hero.currentHp} / {hero.maxHp} HP
							</span>
						</div>
					))}
				</div>

				{/* Camp Actions */}
				<div className="flex gap-6">
					<button
						type="button"
						onClick={handleRest}
						className="w-40 py-4 px-6 bg-zinc-900 border border-zinc-700 hover:border-green-500 hover:bg-zinc-800 rounded-lg flex flex-col items-center transition-all group shadow-lg"
					>
						<span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
							⛺
						</span>
						<span className="font-bold text-sm tracking-widest text-zinc-300 group-hover:text-green-400 transition-colors">
							REST
						</span>
						<span className="text-[10px] text-zinc-500 mt-1">
							Recover 30% HP
						</span>
					</button>

					<button
						type="button"
						onClick={handleTrain}
						className="w-40 py-4 px-6 bg-zinc-900 border border-zinc-700 hover:border-amber-500 hover:bg-zinc-800 rounded-lg flex flex-col items-center transition-all group shadow-lg"
					>
						<span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
							⚔️
						</span>
						<span className="font-bold text-sm tracking-widest text-zinc-300 group-hover:text-amber-400 transition-colors">
							TRAIN
						</span>
						<span className="text-[10px] text-zinc-500 mt-1">
							Upgrade Cards
						</span>
					</button>
				</div>
			</div>

			<button
				type="button"
				onClick={() => setPhase("MAP")}
				className="absolute bottom-8 right-8 px-6 py-2 border border-zinc-700 text-zinc-400 hover:text-white hover:border-white rounded transition-colors text-sm uppercase tracking-widest"
			>
				Leave Camp
			</button>
		</div>
	);
}
