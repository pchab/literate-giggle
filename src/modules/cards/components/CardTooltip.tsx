import type {
	Card,
	CardEffect,
	PlayRequirement,
} from "@/modules/cards/domain/cards.type";
import { formatCardEffect } from "../helpers/cards.helper";

interface CardTooltipProps {
	card: Card;
}

function renderEffectText(effect: CardEffect, index: number) {
	return (
		<span key={index} className="text-xs text-zinc-300 text-left">
			{formatCardEffect(effect)}
		</span>
	);
}

function renderRequirementText(req: PlayRequirement) {
	switch (req) {
		case "requires_enemy":
			return "Target: Enemy";
		case "requires_empty_cell":
			return "Target: Empty Cell";
		case "requires_ally":
			return "Target: Ally";
		case "no_target":
			return "Instant Cast";
		default:
			return `Target: ${req}`;
	}
}

export function CardTooltip({ card }: CardTooltipProps) {
	if (!card) {
		return null;
	}

	return (
		<div className="w-48 bg-zinc-950 border border-zinc-700 rounded-lg shadow-2xl p-3 z-50">
			<div className="flex justify-between items-start border-b border-zinc-800 pb-2 mb-2 gap-2">
				<h3 className="text-sm font-bold text-zinc-100 leading-tight">
					{card.name}
				</h3>
				<span className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded whitespace-nowrap border border-zinc-800">
					Range {card.range}
				</span>
			</div>

			<div className="flex flex-col gap-2 items-start">
				{card.effects.map((effect, idx) => renderEffectText(effect, idx))}
			</div>

			<div className="mt-3 pt-2 border-t border-zinc-800 text-center">
				<span className="text-[10px] text-zinc-500 italic block tracking-wide uppercase">
					{renderRequirementText(card.playRequirement)}
				</span>
			</div>
		</div>
	);
}
