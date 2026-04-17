import type { SurfaceType } from "@/modules/battle/domain/grid.type";
import type { CreateSurfaceEffect } from "@/modules/cards/domain/cards.type";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import { useShallow } from "zustand/shallow";
import type { EffectInputProps } from "./types";

const SURFACE_TYPES: SurfaceType[] = ["TRAP", "SPECIAL", "HAZARD", "TERRAIN"];

export function SurfaceEffectInput({
	effect: { surfaceType, spriteBase, onStep, duration, charges, size },
	onChange,
}: EffectInputProps<CreateSurfaceEffect>) {
	const { cards } = useRegistryStore(
		useShallow((state) => ({ cards: state.cards })),
	);
	const allCards = Object.values(cards);

	return (
		<div className="flex flex-col gap-2 mt-1 p-2 bg-zinc-900 border border-zinc-700 rounded-md">
			<span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
				Surface Payload
			</span>

			{/* Surface Type & Sprite Base */}
			<div className="flex gap-2">
				<div className="w-1/2 flex flex-col">
					<span className="text-[10px] font-semibold text-zinc-400 mb-1">
						Surface Type
					</span>
					<select
						value={surfaceType}
						onChange={(e) =>
							onChange({ surfaceType: e.target.value as SurfaceType })
						}
						className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full text-green-400 font-semibold"
					>
						{SURFACE_TYPES.map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>
				</div>
				<div className="w-1/2 flex flex-col">
					<span className="text-[10px] font-semibold text-zinc-400 mb-1">
						Sprite Base
					</span>
					<input
						type="text"
						value={spriteBase || ""}
						onChange={(e) => onChange({ spriteBase: e.target.value })}
						placeholder="e.g., acid, web"
						className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full font-mono text-zinc-300"
					/>
				</div>
			</div>

			{/* Duration, Damage, Charges */}
			<div className="flex gap-2">
				<div className="w-1/3 flex flex-col">
					<span className="text-[10px] font-semibold text-zinc-400 mb-1">
						Duration
					</span>
					<input
						type="number"
						title="Duration (-1 for infinite)"
						value={duration}
						min="-1"
						onChange={(e) => {
							const val = parseInt(e.target.value, 10);
							onChange({
								duration: Number.isNaN(val) ? 1 : val,
							});
						}}
						className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full"
					/>
				</div>
				<div className="w-1/3 flex flex-col">
					<span className="text-[10px] font-semibold text-zinc-400 mb-1">
						Charges (Opt)
					</span>
					<input
						type="number"
						value={charges ?? ""}
						min="1"
						placeholder="∞"
						onChange={(e) =>
							onChange({
								charges:
									e.target.value === ""
										? undefined
										: parseInt(e.target.value, 10),
							})
						}
						className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full"
					/>
				</div>
			</div>

			{/* Size Options */}
			<div className="flex gap-2 items-end border-t border-zinc-800 pt-2 mt-1">
				<div className="w-1/3 flex flex-col">
					<span className="text-[10px] font-semibold text-zinc-400 mb-1">
						Size Cols (Opt)
					</span>
					<input
						type="number"
						value={size?.cols ?? ""}
						min="1"
						placeholder="1"
						onChange={(e) => {
							const cols = parseInt(e.target.value, 10);
							onChange({
								size: Number.isNaN(cols)
									? undefined
									: { cols, rows: size?.rows || 1 },
							});
						}}
						className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full"
					/>
				</div>
				<div className="w-1/3 flex flex-col">
					<span className="text-[10px] font-semibold text-zinc-400 mb-1">
						Size Rows (Opt)
					</span>
					<input
						type="number"
						value={size?.rows ?? ""}
						min="1"
						placeholder="1"
						onChange={(e) => {
							const rows = parseInt(e.target.value, 10);
							onChange({
								size: Number.isNaN(rows)
									? undefined
									: { cols: size?.cols || 1, rows },
							});
						}}
						className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full"
					/>
				</div>
				<div className="w-1/3 pb-0.5">
					{(size?.cols || size?.rows) && (
						<button
							type="button"
							onClick={() => onChange({ size: undefined })}
							className="text-[10px] w-full bg-zinc-800 hover:bg-red-900/50 text-red-400 border border-zinc-700 rounded py-1"
						>
							Clear Size
						</button>
					)}
				</div>
			</div>

			{/* Optional Status Payload Toggle */}
			<div className="mt-2 pt-2 border-t border-zinc-800">
				<div className="flex justify-between items-center mb-2">
					<span className="text-[10px] font-semibold text-zinc-400">
						Trigger Card on Step (Opt)
					</span>
					<div className="flex-1 flex flex-col">
						<label
							className="text-[10px] uppercase text-zinc-500 font-bold mb-1"
							htmlFor="cardId"
						>
							Card
						</label>
						<select
							value={onStep?.id}
							onChange={(e) => {
								const card = allCards.find(({ id }) => id === e.target.value);
								onChange({ onStep: card });
							}}
							className="px-2 py-1.5 bg-zinc-800 text-sm rounded border border-zinc-700 text-zinc-200 focus:outline-none focus:border-blue-500"
						>
							<option value="" disabled>
								Select an ability...
							</option>
							{allCards.map((card) => (
								<option key={card.id} value={card.id}>
									{card.name}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}
