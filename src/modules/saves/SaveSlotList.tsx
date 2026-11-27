"use client";

import { useEffect, useState } from "react";
import { RetroButton } from "@/modules/shared/components/RetroButton";
import {
	formatSavedAt,
	loadSlot,
	readSlots,
	type SaveSlot,
	saveToSlot,
} from "./saveSlots";

interface SaveSlotListProps {
	/** Show "Save here" buttons (in-game menu). */
	canSave?: boolean;
	/** Called after a slot was loaded into the game. */
	onLoaded?: () => void;
}

/** The browser save slots: what each holds, and save / load buttons. */
export function SaveSlotList({ canSave = false, onLoaded }: SaveSlotListProps) {
	const [slots, setSlots] = useState<(SaveSlot | null)[]>([]);
	const [justSaved, setJustSaved] = useState<number | null>(null);

	// Slots live in localStorage: read them on the client only.
	useEffect(() => setSlots(readSlots()), []);

	const handleSave = (slot: number) => {
		saveToSlot(slot);
		setSlots(readSlots());
		setJustSaved(slot);
	};

	const handleLoad = (slot: number) => {
		if (loadSlot(slot)) onLoaded?.();
	};

	return (
		<ul
			className="flex flex-col gap-3 w-full max-w-2xl"
			aria-label="Save slots"
		>
			{slots.map((save, i) => {
				const slot = i + 1;
				return (
					<li
						key={slot}
						className="flex items-center gap-4 bg-zinc-950/80 border-2 border-zinc-700 px-4 py-3"
					>
						<span className="font-pixel text-2xl text-amber-500 w-8 shrink-0">
							{slot}
						</span>
						<div className="flex-1 min-w-0 font-mono text-xs">
							{save ? (
								<>
									<p className="text-zinc-100 text-sm font-bold truncate">
										{save.location}
										<span className="text-zinc-500 font-normal">
											{" "}
											· {formatSavedAt(save.savedAt)}
										</span>
									</p>
									<p className="text-zinc-400 truncate">{save.objective}</p>
									<p className="text-zinc-500 truncate">{save.party}</p>
								</>
							) : (
								<p className="text-zinc-600 uppercase tracking-widest">Empty</p>
							)}
							{justSaved === slot && (
								<p className="text-emerald-400 uppercase tracking-widest mt-1">
									Saved
								</p>
							)}
						</div>
						<div className="flex gap-2 shrink-0">
							{canSave && (
								<RetroButton onClick={() => handleSave(slot)} variant="primary">
									Save here
								</RetroButton>
							)}
							<RetroButton
								onClick={() => handleLoad(slot)}
								disabled={!save}
								aria-label={`Load slot ${slot}`}
							>
								Load
							</RetroButton>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
