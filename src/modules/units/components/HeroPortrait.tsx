import type { HeroClass } from "@/modules/units/domain/heroClass.types";
import Image from "next/image";
import { spriteVariants } from "../data/spriteVariants.data";
import type { UnitSpriteVariant } from "../domain/units.type";

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
	const imageSrc = PORTRAITS(classType) || "/portraits/squire.webp";

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
				src={imageSrc}
				alt={classType}
				width={80}
				height={80}
				className="absolute inset-0 z-20 m-auto"
				style={{ filter: spriteVariants[variant || "default"] }}
			/>
		</div>
	);
}
