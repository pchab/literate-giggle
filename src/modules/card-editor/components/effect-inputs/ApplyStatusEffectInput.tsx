import type { ApplyStatusEffect } from "@/modules/cards/domain/cards.type";
import type { StatusType } from "@/modules/units/domain/status.type";
import FieldRow from "../FieldRow";
import type { EffectInputProps } from "./types";

const STATUS_TYPES: StatusType[] = [
	"block",
	"poison",
	"rooted",
	"vulnerable",
	"regen",
	"swallowed",
	"digesting",
];

export default function ApplyStatusEffectInput({
	effect: { status },
	onChange,
}: EffectInputProps<ApplyStatusEffect>) {
	return (
		<div className="flex flex-col gap-2 mt-1 p-2 bg-zinc-900 border border-zinc-700 rounded-md">
			<span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
				Status Payload
			</span>

			<FieldRow label="Status Type">
				<select
					value={status.type}
					onChange={(e) =>
						onChange({
							status: {
								...status,
								type: e.target.value as StatusType,
							},
						})
					}
					className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full text-blue-300 font-semibold"
				>
					{STATUS_TYPES.map((t) => (
						<option key={t} value={t}>
							{t}
						</option>
					))}
				</select>
			</FieldRow>

			<div className="flex gap-2">
				<div className="w-1/2 flex items-center">
					<span className="w-1/2 text-[10px] font-semibold text-zinc-400">
						Duration
					</span>
					<input
						type="number"
						title="Duration (-1 for infinite)"
						value={status.duration}
						min="-1"
						onChange={(e) => {
							const val = parseInt(e.target.value, 10);
							onChange({
								status: { ...status, duration: Number.isNaN(val) ? 1 : val },
							});
						}}
						className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-1/2"
					/>
				</div>

				<div className="w-1/2 flex items-center">
					<span className="w-1/2 text-[10px] font-semibold text-zinc-400">
						Amount
					</span>
					<input
						type="number"
						value={status.amount || 0}
						min="0"
						onChange={(e) =>
							onChange({
								status: {
									...status,
									amount: parseInt(e.target.value, 10) || 0,
								},
							})
						}
						className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-1/2"
					/>
				</div>
			</div>
		</div>
	);
}
