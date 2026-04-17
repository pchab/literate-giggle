import type { CardEffect } from "@/modules/cards/domain/cards.type";
import { summonId } from "@/modules/units/helpers/units.helpers";
import ApplyStatusEffectInput from "./effect-inputs/ApplyStatusEffectInput";
import { SharedBaseInputs } from "./effect-inputs/SharedBaseInputs";
import { SurfaceEffectInput } from "./effect-inputs/SurfaceEffectInput";

const EFFECT_TYPES: CardEffect["type"][] = [
	"damage",
	"heal",
	"push",
	"charge",
	"move",
	"summon",
	"apply_status",
	"create_surface",
	"custom_script",
];

interface CardEffectsEditorProps {
	effects: CardEffect[];
	onChange: (effects: CardEffect[]) => void;
}

// Generates a safe default object when switching effect types
function getDefaultEffect(type: CardEffect["type"]): CardEffect {
	switch (type) {
		case "damage":
			return { type: "damage", amount: 1, target: "anchor" };
		case "heal":
			return { type: "heal", amount: 1, target: "anchor" };
		case "push":
			return {
				type: "push",
				distance: 1,
				collisionDamage: 0,
				target: "anchor",
				pushDirection: "away",
			};
		case "charge":
			return {
				type: "charge",
				distance: 1,
				collisionDamage: 0,
				target: "anchor",
			};
		case "move":
			return { type: "move", target: "anchor" };
		case "summon":
			return {
				type: "summon",
				blueprintId: summonId("dummy_target"),
				target: "anchor",
			};
		case "apply_status":
			return {
				type: "apply_status",
				target: "anchor",
				status: { type: "poison", amount: 1, duration: 1 },
			};
		case "create_surface":
			return {
				type: "create_surface",
				target: "anchor",
				surfaceType: "TRAP",
				duration: 1,
				spriteBase: "/surfaces/acid.webp",
			};
		case "custom_script":
			return {
				type: "custom_script",
				target: "anchor",
				scriptId: "my_script",
				payload: {},
			};
	}
}

export function CardEffectsEditor({
	effects,
	onChange,
}: CardEffectsEditorProps) {
	const handleAdd = () => {
		onChange([...effects, getDefaultEffect("damage")]);
	};

	const handleRemove = (index: number) => {
		const newEffects = [...effects];
		newEffects.splice(index, 1);
		onChange(newEffects);
	};

	const updateEffect = (index: number, changes: Partial<CardEffect>) => {
		const newEffects = [...effects];
		newEffects[index] = { ...newEffects[index], ...changes } as CardEffect;
		onChange(newEffects);
	};

	return (
		<div className="flex flex-col gap-4 mt-2">
			{effects.map((effect, index) => (
				<div
					key={crypto.randomUUID()}
					className="flex flex-col bg-zinc-950 border border-zinc-700 rounded p-3 relative"
				>
					{/* Header & Remove Button */}
					<div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-800">
						<select
							value={effect.type}
							onChange={(e) => {
								const newEffects = [...effects];
								newEffects[index] = getDefaultEffect(
									e.target.value as CardEffect["type"],
								);
								onChange(newEffects);
							}}
							className="bg-zinc-800 text-sm rounded border border-zinc-600 px-2 py-1 outline-none text-zinc-200"
						>
							{EFFECT_TYPES.map((t) => (
								<option key={t} value={t}>
									{t.toUpperCase()}
								</option>
							))}
						</select>

						<button
							type="button"
							onClick={() => handleRemove(index)}
							className="text-red-500 hover:text-red-400 font-bold px-2 rounded hover:bg-red-950/50"
							title="Remove Effect"
						>
							✕
						</button>
					</div>
					<div className="flex flex-col gap-2">
						{/* 1. Render the Shared Inputs (Target, Amount, VFX, Distance) */}
						<SharedBaseInputs
							effect={effect}
							onChange={(changes) => updateEffect(index, changes)}
						/>

						{/* 2. Render the Specific Complex Inputs via Switch */}
						{(() => {
							switch (effect.type) {
								case "create_surface":
									return (
										<SurfaceEffectInput
											effect={effect}
											onChange={(c) => updateEffect(index, c)}
										/>
									);
								case "apply_status":
									return (
										<ApplyStatusEffectInput
											effect={effect}
											onChange={(c) => updateEffect(index, c)}
										/>
									);
								case "custom_script":
									// Render JSON fallback for scripts here
									return null;
								default:
									return null; // Basic effects like 'damage' only need the SharedBaseInputs!
							}
						})()}
					</div>
				</div>
			))}

			<button
				type="button"
				onClick={handleAdd}
				className="w-full py-2 border-2 border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 rounded font-bold text-sm transition-colors mt-2"
			>
				+ Add Effect
			</button>
		</div>
	);
}
