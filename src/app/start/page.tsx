"use client";

import { domAnimation, LazyMotion, m } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { RetroButton } from "@/modules/shared/components/RetroButton";
import { useWorldStore } from "@/modules/world/store/world.store";

export default function StartScreen() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [loadError, setLoadError] = useState<string | null>(null);

	const { initializeRoster } = useWorldStore(
		useShallow((state) => ({
			initializeRoster: state.initializeRoster,
		})),
	);

	const handleNewGame = () => {
		initializeRoster();
		router.push("/world");
	};

	const handleLoadGame = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setLoadError(null);
		const reader = new FileReader();

		reader.onload = (event) => {
			try {
				const json = JSON.parse(event.target?.result as string);

				if (json.world && json.campaign && json.version) {
					useWorldStore.setState(json.world);
					useCampaignStore.setState(json.campaign);

					router.push("/");
				} else {
					setLoadError("Invalid save file structure.");
				}
			} catch (_error) {
				setLoadError("Failed to parse the save file. Is it corrupted?");
			}

			if (fileInputRef.current) fileInputRef.current.value = "";
		};

		reader.readAsText(file);
	};

	return (
		<LazyMotion features={domAnimation}>
			<main className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-black">
				{/* --- BACKGROUND IMAGE --- */}
				<div className="absolute inset-0 z-0">
					<Image
						src="/start_screen.webp"
						alt="Hobo to Hero Journey"
						fill
						priority
						className="object-cover object-center animate-pulse-slow"
					/>
				</div>

				{/* --- OVERLAY GRADIENT --- */}
				<div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] bg-black/20" />
				<div className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

				{/* --- UI CONTENT --- */}
				<div className="relative z-20 flex flex-col items-center gap-12 mt-32">
					{/* TITLE */}
					<m.div
						initial={{ opacity: 0, y: -30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1.2, ease: "easeOut" }}
						className="text-center flex flex-col gap-2"
					>
						<h1 className="text-7xl md:text-9xl font-pixel text-yellow-500 tracking-widest uppercase text-shadow-pixel drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
							The Long Road
						</h1>
						<p className="text-slate-300 font-mono text-sm md:text-base tracking-[0.3em] uppercase drop-shadow-md">
							From the Gutters to Glory
						</p>
					</m.div>

					{/* BUTTONS */}
					<m.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
						className="flex flex-col gap-4 w-64"
					>
						<RetroButton
							onClick={handleNewGame}
							variant="primary"
							className="w-full py-4 text-xl shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] transition-shadow"
						>
							New Game
						</RetroButton>

						<RetroButton
							onClick={handleLoadGame}
							variant="default"
							className="w-full py-4 text-xl"
						>
							Load Game
						</RetroButton>

						<input
							type="file"
							accept=".json"
							ref={fileInputRef}
							onChange={handleFileChange}
							className="hidden"
						/>

						{loadError && (
							<span className="text-red-500 font-mono text-xs font-bold uppercase tracking-wider bg-red-950/80 px-2 py-1 rounded">
								{loadError}
							</span>
						)}
					</m.div>
				</div>

				{/* --- FOOTER VERSION INFO --- */}
				<m.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 2, duration: 1 }}
					className="absolute bottom-4 right-6 z-20 text-zinc-500 font-mono text-xs"
				>
					v0.1.0 Alpha
				</m.div>
			</main>
		</LazyMotion>
	);
}
