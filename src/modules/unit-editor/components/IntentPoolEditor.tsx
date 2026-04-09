import type { Card } from "@/modules/cards/domain/cards.type";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import type { UnitBlueprint } from "@/modules/units/domain/units.type";
import { useShallow } from "zustand/shallow";

type IntentOption = UnitBlueprint["intentPool"][0];

export function IntentPoolEditor({
	intents,
	onChange,
}: {
	intents: IntentOption[];
	onChange: (intents: IntentOption[]) => void;
}) {
	const { cards } = useRegistryStore(
		useShallow((state) => ({ cards: state.cards })),
	);
	const allCards = Object.values(cards);

	const handleAdd = () => {
		const defaultCardId =
			allCards.length > 0 ? allCards[0].id : ("" as Card["id"]);
		onChange([...intents, { cardId: defaultCardId, weight: 1 }]);
	};

	const handleRemove = (index: number) => {
		const newIntents = [...intents];
		newIntents.splice(index, 1);
		onChange(newIntents);
	};

	const updateIntent = (index: number, changes: Partial<IntentOption>) => {
		const newIntents = [...intents];
		newIntents[index] = { ...newIntents[index], ...changes };
		onChange(newIntents);
	};

	return (
		<div className="flex flex-col gap-2">
			{intents.map((intent, index) => (
				<div
					key={intent.cardId}
					className="flex items-center gap-2 bg-zinc-950 p-2 rounded border border-zinc-700"
				>
					<div className="flex-1 flex flex-col">
						<label
							className="text-[10px] uppercase text-zinc-500 font-bold mb-1"
							htmlFor="cardId"
						>
							Card
						</label>
						<select
							value={intent.cardId}
							onChange={(e) =>
								updateIntent(index, { cardId: e.target.value as Card["id"] })
							}
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

					<div className="flex flex-col w-20">
						<span className="text-[10px] text-zinc-500 font-bold">Weight</span>
						<input
							type="number"
							value={intent.weight}
							min="1"
							onChange={(e) =>
								updateIntent(index, {
									weight: parseInt(e.target.value, 10) || 1,
								})
							}
							className="bg-zinc-800 text-xs rounded border border-zinc-700 px-2 py-1 w-full"
						/>
					</div>
					<button
						type="button"
						onClick={() => handleRemove(index)}
						className="text-red-500 hover:text-red-400 font-bold px-2 mt-4 rounded hover:bg-red-950/50"
						title="Remove Intent"
					>
						✕
					</button>
				</div>
			))}
			<button
				type="button"
				onClick={handleAdd}
				className="w-full py-1.5 border-2 border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 rounded text-xs font-bold transition-colors mt-1"
			>
				+ Add Intent
			</button>
		</div>
	);
}
