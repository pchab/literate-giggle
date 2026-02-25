import Image from "next/image";
import type { HeroClass } from "@/modules/heroClass/heroClass.types";

interface HeroPortraitProps {
	classType: HeroClass;
}

const PORTRAITS: Record<HeroClass, string> = {
	SQUIRE: "/portraits/hero_portrait_squire.png",
	KNIGHT: "/portraits/hero_portrait_knight.png",
	CRYOMANCER: "/portraits/hero_portrait_cryomancer.png",
	PYROMANCER: "/portraits/hero_portrait_pyromancer.png",
	BARBARIAN: "/portraits/hero_portrait_barbarian.png",
	PALADIN: "/portraits/hero_portrait_paladin.png",
	CLERIC: "/portraits/hero_portrait_cleric.png",
	THIEF: "/portraits/hero_portrait_thief.png",
};

export function HeroPortrait({ classType }: HeroPortraitProps) {
	const imageSrc = PORTRAITS[classType] || "/hero_portrait_squire.png"; // Fallback

	return (
		<div className="relative w-48 h-36 m-4">
			<Image
				src="/hero_runes.png"
				alt="Hero Runes"
				width={120}
				height={120}
				className="absolute inset-0 z-0 m-auto"
			/>
			<Image
				src={imageSrc}
				alt={classType}
				width={80}
				height={80}
				className="absolute inset-0 z-10 m-auto"
			/>
		</div>
	);
}
