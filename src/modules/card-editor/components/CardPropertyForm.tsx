import {
	adjacentPattern,
	cleavePattern,
	conePattern,
	crossPattern,
	linePattern,
	squarePattern,
} from "@/modules/battle/data/attackPattern.data";
import type { GridPosition } from "@/modules/battle/domain/grid.type";
import { isGridPosition } from "@/modules/battle/helpers/grid.helpers";
import {
	type Card,
	PLAY_REQUIREMENTS,
} from "@/modules/cards/domain/cards.type";
import { ImageUploadArea } from "@/modules/shared/components/ImageUploadArea";
import { useAssetStore } from "@/modules/shared/store/asset.store";
import { useShallow } from "zustand/shallow";
import { useCardEditorStore } from "../store/cardEditor.store";
import { CardEffectsEditor } from "./CardEffectsEditor";

const AI_PREFERENCES: string[] = [
	"lowestHp",
	"random",
	"lowestDef",
	"closest",
	"self",
	"away",
];

export function CardPropertyForm() {
	const { draftCard, testMode, setTestMode, updateDraft, saveToDatabase } =
		useCardEditorStore(
			useShallow((state) => ({
				draftCard: state.draftCard,
				testMode: state.testMode,
				setTestMode: state.setTestMode,
				updateDraft: state.updateDraft,
				saveToDatabase: state.saveToDatabase,
			})),
		);

	const handleTextChange =
		(field: keyof typeof draftCard) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			updateDraft({ [field]: e.target.value });
		};

	const handleNumberChange =
		(field: keyof typeof draftCard) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			updateDraft({ [field]: parseInt(e.target.value, 10) || 0 });
		};

	const handleSave = async () => {
		try {
			await saveToDatabase();
		} catch (error) {
			console.error("Failed to save card:", error);
		}
	};

	return (
		<div className="flex flex-col h-full p-4 bg-zinc-900 border-r border-zinc-700 text-zinc-100 overflow-y-auto w-full shadow-xl">
			<h2 className="text-xl font-bold mb-6 text-zinc-100 border-b border-zinc-700 pb-2">
				Card Properties
			</h2>

			<div className="space-y-4">
				{/* Name */}
				<div className="flex flex-col">
					<label
						htmlFor="card-name"
						className="text-sm font-semibold text-zinc-400 mb-1"
					>
						Card Name
					</label>
					<input
						id="card-name"
						type="text"
						value={draftCard.name}
						onChange={handleTextChange("name")}
						className="px-3 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
					/>
				</div>

				{/* Range & AoE Pattern (Side by side) */}
				<div className="flex gap-4">
					<div className="flex flex-col w-1/3">
						<label
							htmlFor="card-range"
							className="text-sm font-semibold text-zinc-400 mb-1"
						>
							Range
						</label>
						<input
							id="card-range"
							type="number"
							min="0"
							value={draftCard.range}
							onChange={handleNumberChange("range")}
							className="px-3 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
						/>
					</div>
					<div className="flex flex-col w-2/3">
						<label
							htmlFor="card-aoe"
							className="text-sm font-semibold text-zinc-400 mb-1"
						>
							AoE Pattern
						</label>
						<select
							id="card-aoe"
							// Fallback to empty string for "Single Target" (undefined)
							value={
								draftCard.aoePattern ? JSON.stringify(draftCard.aoePattern) : ""
							}
							onChange={(e) => {
								const val = e.target.value;
								updateDraft({ aoePattern: val ? JSON.parse(val) : undefined });
							}}
							className="px-3 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
						>
							<option value="">Single Target (None)</option>
							<option value={JSON.stringify(cleavePattern)}>Cleave</option>
							<option value={JSON.stringify(adjacentPattern)}>Adjacent</option>
							<option value={JSON.stringify(crossPattern)}>Cross</option>
							<option value={JSON.stringify(squarePattern)}>Square</option>
							<option value={JSON.stringify(linePattern)}>Line</option>
							<option value={JSON.stringify(conePattern)}>Cone</option>
						</select>
					</div>
				</div>

				{/* Play Requirement */}
				<div className="flex flex-col">
					<label
						htmlFor="card-play-req"
						className="text-sm font-semibold text-zinc-400 mb-1"
					>
						Play Requirement
					</label>
					<select
						id="card-play-req"
						value={draftCard.playRequirement}
						onChange={handleTextChange("playRequirement")}
						className="px-3 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
					>
						{PLAY_REQUIREMENTS.map((req) => (
							<option key={req} value={req}>
								{req}
							</option>
						))}
					</select>
				</div>

				{/* AI Target Preference */}
				<div className="flex flex-col p-3 bg-zinc-950 border border-zinc-700 rounded-md">
					<label
						className="text-sm font-semibold text-zinc-400 mb-1"
						htmlFor="card-ai-target-pref"
					>
						AI Target Preference
					</label>
					<select
						id="card-ai-target-pref"
						value={
							typeof draftCard.aiTargetPreference === "string"
								? draftCard.aiTargetPreference
								: draftCard.aiTargetPreference
									? "grid"
									: ""
						}
						onChange={(e) => {
							const val = e.target.value;
							if (val === "") updateDraft({ aiTargetPreference: undefined });
							else if (val === "grid")
								updateDraft({ aiTargetPreference: { col: 0, row: 0 } });
							else
								updateDraft({
									aiTargetPreference: val as Card["aiTargetPreference"],
								});
						}}
						className="px-3 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500 text-sm text-purple-300 font-semibold"
					>
						<option value="">None (Default)</option>
						{AI_PREFERENCES.map((pref) => (
							<option key={pref} value={pref}>
								{pref}
							</option>
						))}
						<option value="grid">Specific Grid Position</option>
					</select>

					{/* Custom Grid Position Inputs */}
					{isGridPosition(draftCard.aiTargetPreference) && (
						<div className="flex gap-2 mt-2 pt-2 border-t border-zinc-800">
							<div className="flex flex-col w-1/2">
								<span className="text-[10px] text-zinc-500 font-bold mb-1">
									Col
								</span>
								<input
									type="number"
									value={draftCard.aiTargetPreference.col}
									onChange={(e) =>
										updateDraft({
											aiTargetPreference: {
												...(draftCard.aiTargetPreference as GridPosition),
												col: parseInt(e.target.value, 10) || 0,
											},
										})
									}
									className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1"
								/>
							</div>
							<div className="flex flex-col w-1/2">
								<span className="text-[10px] text-zinc-500 font-bold mb-1">
									Row
								</span>
								<input
									type="number"
									value={draftCard.aiTargetPreference.row}
									onChange={(e) =>
										updateDraft({
											aiTargetPreference: {
												...(draftCard.aiTargetPreference as GridPosition),
												row: parseInt(e.target.value, 10) || 0,
											},
										})
									}
									className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1"
								/>
							</div>
						</div>
					)}
				</div>

				{/* Image path */}
				<div className="flex flex-col">
					<label
						htmlFor="card-image"
						className="text-sm font-semibold text-zinc-400 mb-1"
					>
						Image Path
					</label>
					<ImageUploadArea
						label="Card Illustration"
						currentImage={draftCard.image}
						onImageChange={async (blobUrl, file) => {
							updateDraft({ image: blobUrl });
							await useAssetStore
								.getState()
								.saveAsset(`/cards/${draftCard.id}`, file);
						}}
					/>
				</div>

				{/* Effects JSON Editor */}
				<div className="flex flex-col pt-4 border-t border-zinc-700 mt-2">
					<label
						className="text-sm font-bold text-zinc-300 mb-1"
						htmlFor="effects"
					>
						Card Effects Sequence
					</label>
					<CardEffectsEditor
						effects={draftCard.effects}
						onChange={(newEffects) => updateDraft({ effects: newEffects })}
					/>
				</div>
			</div>

			{/* Test Mode Toggle */}
			<div className="flex flex-col gap-2 pt-4 border-t border-zinc-700 mt-4">
				<span className="text-sm font-bold text-zinc-300">
					Sandbox Test Mode
				</span>
				<div className="flex items-center justify-between bg-zinc-950 p-1 rounded-md border border-zinc-800">
					<button
						type="button"
						onClick={() => setTestMode("PLAYER")}
						className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${
							testMode === "PLAYER"
								? "bg-blue-600 text-white shadow-md"
								: "text-zinc-500 hover:text-zinc-300"
						}`}
					>
						Play as Hero
					</button>
					<button
						type="button"
						onClick={() => setTestMode("AI")}
						className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${
							testMode === "AI"
								? "bg-purple-600 text-white shadow-md"
								: "text-zinc-500 hover:text-zinc-300"
						}`}
					>
						Test AI Cast
					</button>
				</div>
			</div>

			<div className="mt-auto pt-6">
				<button
					type="button"
					onClick={handleSave}
					className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded transition-colors"
				>
					Save Card to Database
				</button>
			</div>
		</div>
	);
}
