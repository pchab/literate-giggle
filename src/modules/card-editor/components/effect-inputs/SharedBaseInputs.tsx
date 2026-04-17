import type { VfxType } from "@/modules/battle/domain/vfx.type";
import type {
	CardEffect,
	DamageEffect,
	EffectTarget,
	PushEffect,
	SummonEffect,
} from "@/modules/cards/domain/cards.type";
import FieldRow from "../FieldRow";
import type { EffectInputProps } from "./types";

const EFFECT_TARGETS: EffectTarget[] = [
	"anchor",
	"self",
	"all_enemies",
	"all_allies",
	"adjacent_to_anchor",
	"path",
];

const AVAILABLE_VFX: NonNullable<VfxType>[] = [
	"SLASH",
	"HEAL",
	"BLOCK",
	"POISON",
	"ARROW",
	"FIREBALL",
	"ACID_SPIT",
	"FIRE",
	"BLUNT",
	"ICE",
	"NECROBOLT",
	"NECROTIC_IMPACT",
	"ESCAPE",
];

export function SharedBaseInputs({
	effect,
	onChange,
}: EffectInputProps<CardEffect>) {
	return (
		<div className="flex flex-col gap-2">
			{/* TARGET (Shared by almost all effects except charge) */}
			{effect.type !== "charge" && (
				<FieldRow label="Target">
					<select
						value={effect.target || "anchor"}
						onChange={(e) =>
							onChange({
								target: e.target.value as EffectTarget,
							} as Partial<CardEffect>)
						}
						className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full"
					>
						{EFFECT_TARGETS.map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>
				</FieldRow>
			)}

			{/* AMOUNT (Damage, Heal) */}
			{"amount" in effect && (
				<FieldRow label="Amount">
					<input
						type="number"
						value={effect.amount}
						min="0"
						onChange={(e) =>
							onChange({
								amount: parseInt(e.target.value, 10) || 0,
							} as Partial<CardEffect>)
						}
						className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full"
					/>
				</FieldRow>
			)}

			{/* DISTANCE & COLLISION (Push, Charge) */}
			{"distance" in effect && (
				<>
					<FieldRow label="Distance">
						<input
							type="number"
							value={effect.distance}
							min="1"
							onChange={(e) =>
								onChange({
									distance: parseInt(e.target.value, 10) || 1,
								} as Partial<CardEffect>)
							}
							className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full"
						/>
					</FieldRow>
					<FieldRow label="Collision Dmg">
						<input
							type="number"
							value={effect.collisionDamage}
							min="0"
							onChange={(e) =>
								onChange({
									collisionDamage: parseInt(e.target.value, 10) || 0,
								} as Partial<CardEffect>)
							}
							className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full"
						/>
					</FieldRow>
				</>
			)}

			{/* PUSH DIRECTION (Push only) */}
			{effect.type === "push" && (
				<FieldRow label="Direction">
					<select
						value={effect.pushDirection || "away"}
						onChange={(e) =>
							onChange({
								pushDirection: e.target.value as PushEffect["pushDirection"],
							} as Partial<CardEffect>)
						}
						className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full"
					>
						<option value="away">Away</option>
						<option value="towards">Towards</option>
						<option value="sideways">Sideways</option>
					</select>
				</FieldRow>
			)}

			{/* BLUEPRINT ID (Summon only) */}
			{effect.type === "summon" && (
				<FieldRow label="Blueprint ID">
					<input
						type="text"
						value={effect.blueprintId}
						onChange={(e) =>
							onChange({
								blueprintId: e.target.value as SummonEffect["blueprintId"],
							} as Partial<SummonEffect>)
						}
						className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full font-mono text-zinc-300"
					/>
				</FieldRow>
			)}

			{/* VFX / PROJECTILE (Damage, Heal, Apply Status) */}
			{("vfx" in effect || "projectile" in effect) && (
				<FieldRow label="VFX / Proj">
					<div className="flex gap-1 w-full">
						<select
							value={(effect as DamageEffect).vfx || ""}
							onChange={(e) =>
								onChange({
									vfx: (e.target.value as VfxType) || undefined,
								} as Partial<CardEffect>)
							}
							className="bg-zinc-800 text-xs rounded border border-zinc-700 px-1 py-1 w-1/2"
						>
							<option value="">No VFX</option>
							{AVAILABLE_VFX.map((v) => (
								<option key={v} value={v}>
									{v}
								</option>
							))}
						</select>
						<select
							value={(effect as DamageEffect).projectile || ""}
							onChange={(e) =>
								onChange({
									projectile: (e.target.value as VfxType) || undefined,
								} as Partial<CardEffect>)
							}
							className="bg-zinc-800 text-xs rounded border border-zinc-700 px-1 py-1 w-1/2"
						>
							<option value="">No Proj</option>
							{AVAILABLE_VFX.map((v) => (
								<option key={v} value={v}>
									{v}
								</option>
							))}
						</select>
					</div>
				</FieldRow>
			)}
		</div>
	);
}
