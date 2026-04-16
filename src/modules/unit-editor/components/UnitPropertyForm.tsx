import { useShallow } from "zustand/shallow";
import { ImageUploadArea } from "@/modules/shared/components/ImageUploadArea";
import { useSprite } from "@/modules/shared/hooks/useSprite";
import { useAssetStore } from "@/modules/shared/store/asset.store";
import { UnitStance } from "@/modules/units/domain/units.type";
import { useUnitEditorStore } from "../store/unitEditor.store";
import { IntentPoolEditor } from "./IntentPoolEditor";

export function UnitPropertyForm() {
	const { draftUnit, updateDraft, saveToDatabase } = useUnitEditorStore(
		useShallow((state) => ({
			draftUnit: state.draftUnit,
			updateDraft: state.updateDraft,
			saveToDatabase: state.saveToDatabase,
		})),
	);
	const { saveAsset } = useAssetStore(
		useShallow((state) => ({
			sprites: state.sprites,
			saveAsset: state.saveAsset,
		})),
	);
	const idleSprite = useSprite(`${draftUnit.spriteBase}_${UnitStance.IDLE}`);
	const movingSprite = useSprite(
		`${draftUnit.spriteBase}_${UnitStance.MOVING}`,
	);
	const attackingSprite = useSprite(
		`${draftUnit.spriteBase}_${UnitStance.ATTACKING}`,
	);

	const handleTextChange =
		(field: keyof typeof draftUnit) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			updateDraft({ [field]: e.target.value });
		};

	const handleNumberChange =
		(field: keyof typeof draftUnit) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			updateDraft({ [field]: parseInt(e.target.value, 10) || 0 });
		};

	const handleSpriteUpload = async (stance: UnitStance, file: File) => {
		const spriteId = `${draftUnit.spriteBase}_${stance}`;
		await saveAsset(spriteId, file);
	};

	const handleSave = async () => {
		try {
			await saveToDatabase();
		} catch (error) {
			console.error("Failed to save unit:", error);
		}
	};

	return (
		<div className="flex flex-col h-full p-4 bg-zinc-900 border-r border-zinc-700 text-zinc-100 overflow-y-auto w-full shadow-xl">
			<h2 className="text-xl font-bold mb-6 text-zinc-100 border-b border-zinc-700 pb-2">
				Unit Blueprint
			</h2>

			<div className="space-y-4">
				{/* Core Identifiers */}
				<div className="flex gap-3">
					<div className="flex flex-col flex-1">
						<label
							htmlFor="unit-name"
							className="text-sm font-semibold text-zinc-400 mb-1"
						>
							Name
						</label>
						<input
							id="unit-name"
							type="text"
							value={draftUnit.name}
							onChange={handleTextChange("name")}
							className="px-3 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
						/>
					</div>
				</div>

				{/* NEW: Sprite Assets Section */}
				<div className="mt-6 pt-4 border-t border-zinc-700">
					<label
						className="text-sm font-bold text-zinc-300 mb-4 block"
						htmlFor="spriteBase"
					>
						Stance Sprites
					</label>

					<div className="grid grid-cols-3 gap-2">
						<ImageUploadArea
							label="Idle"
							currentImage={idleSprite}
							onImageChange={(_url, file) =>
								handleSpriteUpload(UnitStance.IDLE, file)
							}
						/>
						<ImageUploadArea
							label="Moving"
							currentImage={movingSprite}
							onImageChange={(_url, file) =>
								handleSpriteUpload(UnitStance.MOVING, file)
							}
						/>
						<ImageUploadArea
							label="Attacking"
							currentImage={attackingSprite}
							onImageChange={(_url, file) =>
								handleSpriteUpload(UnitStance.ATTACKING, file)
							}
						/>
					</div>
				</div>

				{/* Base Combat Stats */}
				<div className="bg-zinc-950 p-3 rounded-md border border-zinc-800">
					<label
						className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block"
						htmlFor="stats"
					>
						Base Combat Stats
					</label>
					<div className="grid grid-cols-2 gap-3">
						<div className="flex items-center justify-between bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
							<span className="text-xs font-semibold text-zinc-400">
								Max HP
							</span>
							<input
								type="number"
								min="1"
								value={draftUnit.maxHp}
								onChange={handleNumberChange("maxHp")}
								className="w-16 bg-zinc-800 text-right px-1 py-1 rounded text-sm text-green-400 font-bold"
							/>
						</div>
						<div className="flex items-center justify-between bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
							<span className="text-xs font-semibold text-zinc-400">
								Base Def
							</span>
							<input
								type="number"
								min="0"
								value={draftUnit.baseDef}
								onChange={handleNumberChange("baseDef")}
								className="w-16 bg-zinc-800 text-right px-1 py-1 rounded text-sm text-blue-400 font-bold"
							/>
						</div>
						<div className="flex items-center justify-between bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
							<span className="text-xs font-semibold text-zinc-400">
								Base Move
							</span>
							<input
								type="number"
								min="0"
								value={draftUnit.baseMove}
								onChange={handleNumberChange("baseMove")}
								className="w-16 bg-zinc-800 text-right px-1 py-1 rounded text-sm text-yellow-500 font-bold"
							/>
						</div>
						<div className="flex items-center justify-between bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
							<span className="text-xs font-semibold text-zinc-400">
								XP Reward
							</span>
							<input
								type="number"
								min="0"
								value={draftUnit.xpReward}
								onChange={handleNumberChange("xpReward")}
								className="w-16 bg-zinc-800 text-right px-1 py-1 rounded text-sm text-purple-400 font-bold"
							/>
						</div>
					</div>
				</div>

				{/* The Intent Pool Editor */}
				<div className="pt-2 border-t border-zinc-700 mt-2">
					<label
						className="text-sm font-bold text-zinc-300 mb-2 block"
						htmlFor="intent-pool"
					>
						AI Intent Pool
					</label>
					<IntentPoolEditor
						intents={draftUnit.intentPool}
						onChange={(newIntents) => updateDraft({ intentPool: newIntents })}
					/>
				</div>

				<div className="mt-8 pt-6 border-t border-zinc-700 pb-4">
					<button
						type="button"
						onClick={handleSave}
						className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-colors border border-blue-400/50"
					>
						Save Unit to Database
					</button>
				</div>
			</div>
		</div>
	);
}
