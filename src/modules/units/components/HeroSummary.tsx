"use client";

import Image from "next/image";
import { HeroCardView } from "@/modules/cards/components/HeroCardView";
import { CLASS_REGISTRY } from "../data/heroClass.data";
import { getHeroColor } from "../data/heroPalette.data";
import type { Hero } from "../domain/units.type";
import { useHeroSprite } from "../hooks/useHeroSprite";
import { PassiveChip } from "./PassiveChip";

export function HeroAvatar({ hero, size = 56 }: { hero: Hero; size?: number }) {
	const portrait = useHeroSprite(
		`/portraits/${hero.heroClass.toLowerCase()}.webp`,
		hero.variant,
		true,
	);
	const { hex } = getHeroColor(hero.variant);
	return (
		<div
			className="shrink-0 rounded-full bg-zinc-900 border-2 overflow-hidden flex items-center justify-center"
			style={{
				width: size,
				height: size,
				borderColor: hex,
				boxShadow: `0 0 8px ${hex}55`,
			}}
		>
			<Image
				src={portrait.src}
				alt={hero.heroClass}
				width={size}
				height={size}
				style={{ filter: portrait.filter }}
			/>
		</div>
	);
}

/** Identity + stats + passives (+ optionally the full deck with upgrades). */
export function HeroSummary({
	hero,
	showDeck = true,
	className = "",
}: {
	hero: Hero;
	showDeck?: boolean;
	className?: string;
}) {
	const classDef = CLASS_REGISTRY[hero.heroClass];
	const handIds = new Set(
		hero.selectedCards.filter((c) => !!c).map((c) => c?.instanceId),
	);
	const showHand = hero.deck.length > handIds.size;

	return (
		<div
			className={`flex flex-col gap-3 bg-zinc-900/60 border border-zinc-800 rounded-md p-3 ${className}`}
		>
			<div className="flex items-center gap-3">
				<HeroAvatar hero={hero} />
				<div className="flex flex-col gap-1 min-w-0">
					<span
						className="font-pixel text-lg tracking-widest uppercase leading-none"
						style={{ color: getHeroColor(hero.variant).hex }}
					>
						{hero.name}
					</span>
					<span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
						{classDef?.name ?? hero.heroClass} · Lv.{hero.currentLevel}
					</span>
					<span className="text-[11px] font-mono text-zinc-400">
						❤️ {hero.maxHp} · 🛡️ {hero.baseDef} · 👟 {hero.baseMove}
					</span>
				</div>
			</div>

			{hero.passives.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{hero.passives.map((id) => (
						<PassiveChip key={id} passiveId={id} />
					))}
				</div>
			)}

			{showDeck && (
				<div className="flex flex-wrap gap-2 pt-2 justify-center">
					{hero.deck.map((heroCard) => (
						<HeroCardView
							key={heroCard.instanceId}
							heroCard={heroCard}
							inHand={showHand && handIds.has(heroCard.instanceId)}
							isPlayable={false}
						/>
					))}
				</div>
			)}
		</div>
	);
}
