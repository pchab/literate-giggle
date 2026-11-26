"use client";

import type { RuneDraftOption } from "@/modules/units/domain/heroClass.types";
import type { HeroCard } from "../domain/cards.type";
import { getComputedCard } from "../helpers/cards.helper";
import {
	describePowerRunes,
	describeRune,
	withRune,
} from "../helpers/powerRunes.helper";
import { BattleCard } from "./BattleCard";
import { CardTooltip } from "./CardTooltip";

/**
 * A hero's card instance, with its upgrades made visible:
 * rune badges, an "in hand" marker, and an optional preview of a new rune.
 */
export function HeroCardView({
	heroCard,
	size = "normal",
	inHand = false,
	previewRune,
	isPlayable = true,
	dimmed = false,
	onClick,
	tooltip = true,
}: {
	heroCard: HeroCard;
	size?: "normal" | "large";
	inHand?: boolean;
	previewRune?: RuneDraftOption;
	isPlayable?: boolean;
	dimmed?: boolean;
	onClick?: () => void;
	tooltip?: boolean;
}) {
	const shown = previewRune ? withRune(heroCard, previewRune) : heroCard;
	const card = getComputedCard(shown);
	const badges = describePowerRunes(heroCard.powerRunes);

	return (
		<div
			className={`relative flex flex-col items-center gap-1 group/hcv ${dimmed ? "opacity-40 grayscale" : ""}`}
		>
			{inHand && (
				<span className="absolute -top-2 left-1/2 -translate-x-1/2 z-50 text-[8px] font-bold uppercase tracking-widest bg-amber-500 text-zinc-950 px-1.5 rounded-sm shadow">
					In hand
				</span>
			)}

			<BattleCard
				card={card}
				size={size}
				isPlayable={isPlayable}
				isStatic={!onClick}
				onClick={onClick}
			/>

			<div className="flex flex-wrap justify-center gap-0.5 min-h-4 max-w-full">
				{badges.map((b) => (
					<span
						key={b}
						className="text-[9px] leading-none font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-1 py-0.5 rounded-sm whitespace-nowrap"
					>
						{b}
					</span>
				))}
				{previewRune && (
					<span className="text-[9px] leading-none font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-600 px-1 py-0.5 rounded-sm whitespace-nowrap animate-pulse">
						{describeRune(previewRune)} new
					</span>
				)}
			</div>

			{tooltip && (
				<div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 z-60 pointer-events-none opacity-0 group-hover/hcv:opacity-100 transition-opacity">
					<CardTooltip card={card} />
				</div>
			)}
		</div>
	);
}
