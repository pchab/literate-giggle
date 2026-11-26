import { describeRune } from "@/modules/cards/helpers/powerRunes.helper";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import { PassiveChip } from "@/modules/units/components/PassiveChip";
import type { HeroDraftResult } from "@/modules/units/domain/heroClass.types";
import type { Hero } from "@/modules/units/domain/units.type";

/** Plain list of what this hero picked, so nothing is a guess. */
export default function DraftSummary({
	hero,
	result,
	compact = false,
}: {
	hero: Hero;
	result: HeroDraftResult;
	compact?: boolean;
}) {
	const getCard = useRegistryStore((s) => s.getCard);
	const nameOfInstance = (instanceId: string) => {
		const owned = hero.deck.find((c) => c.instanceId === instanceId);
		return owned ? (getCard(owned.baseCardId)?.name ?? "?") : "?";
	};
	const handIds = new Set(hero.selectedCards.map((c) => c?.baseCardId));

	return (
		<div
			className={`flex flex-col gap-1 bg-zinc-900/60 border border-zinc-800 rounded p-2 ${compact ? "text-[10px]" : "text-xs"}`}
		>
			<span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
				{compact ? "Picked so far" : "Picked"}
			</span>
			{result.cards.map((id) => (
				<span key={id} className="text-sky-300">
					📜 Learned {getCard(id)?.name ?? id}
					{handIds.has(id) && (
						<span className="text-zinc-500"> · equipped</span>
					)}
				</span>
			))}
			{result.passives.map((id) => (
				<span key={id}>
					<PassiveChip passiveId={id} />
				</span>
			))}
			{result.runes.map(({ rune, cardInstanceId }, i) => (
				<span key={`${cardInstanceId}-${i}`} className="text-emerald-300">
					✨ {describeRune(rune)} → {nameOfInstance(cardInstanceId)}
				</span>
			))}
		</div>
	);
}
