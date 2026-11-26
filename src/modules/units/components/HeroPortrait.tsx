"use client";

import Image from "next/image";
import type { HeroClass } from "@/modules/units/domain/heroClass.types";
import type { UnitSpriteVariant } from "../domain/units.type";
import { useHeroSprite } from "../hooks/useHeroSprite";

interface HeroPortraitProps {
	classType: HeroClass;
	variant?: UnitSpriteVariant;
}

const PORTRAITS = (HeroClass: HeroClass) => {
	return `/portraits/${HeroClass.toLowerCase()}.webp`;
};

export function HeroPortrait({
	classType,
	variant = "default",
}: HeroPortraitProps) {
	const portrait = useHeroSprite(
		PORTRAITS(classType) || "/portraits/squire.webp",
		variant,
		true,
	);

	return (
		<div className="relative w-48 h-36 m-4">
			<Image
				src="/hero_runes.webp"
				alt="Hero Runes"
				width={120}
				height={120}
				className="absolute inset-0 z-10 m-auto"
			/>
			<Image
				src={portrait.src}
				alt={classType}
				width={80}
				height={80}
				className="absolute inset-0 z-20 m-auto"
				style={{ filter: portrait.filter }}
			/>
		</div>
	);
}
