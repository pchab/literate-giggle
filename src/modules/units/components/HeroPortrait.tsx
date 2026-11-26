"use client";

import Image from "next/image";
import type { HeroClass } from "@/modules/units/domain/heroClass.types";
import type { UnitSpriteVariant } from "../domain/units.type";
import { useHeroSprite } from "../hooks/useHeroSprite";

interface HeroPortraitProps {
	classType: HeroClass;
	variant?: UnitSpriteVariant;
	/** Smaller below 1100px wide (battle panels). */
	compact?: boolean;
}

const PORTRAITS = (HeroClass: HeroClass) => {
	return `/portraits/${HeroClass.toLowerCase()}.webp`;
};

export function HeroPortrait({
	classType,
	variant = "default",
	compact = false,
}: HeroPortraitProps) {
	const portrait = useHeroSprite(
		PORTRAITS(classType) || "/portraits/squire.webp",
		variant,
		true,
	);

	const box = compact
		? "w-20 h-24 m-1 min-[1100px]:w-48 min-[1100px]:h-36 min-[1100px]:m-4"
		: "w-48 h-36 m-4";
	const ring = compact ? "w-[84px] min-[1100px]:w-[120px]" : "";
	const face = compact ? "w-[56px] min-[1100px]:w-[80px]" : "";

	return (
		<div className={`relative ${box}`}>
			<Image
				src="/hero_runes.webp"
				alt="Hero Runes"
				width={120}
				height={120}
				className={`absolute inset-0 z-10 m-auto ${ring}`}
			/>
			<Image
				src={portrait.src}
				alt={classType}
				width={80}
				height={80}
				className={`absolute inset-0 z-20 m-auto ${face}`}
				style={{ filter: portrait.filter }}
			/>
		</div>
	);
}
