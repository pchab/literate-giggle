import { motion } from "motion/react";
import Image from "next/image";
import { UnitStance } from "@/modules/figures/domain/figures.type";

interface UnitSpriteProps {
	spriteBase: string;
	stance?: UnitStance;
	isHit?: boolean;
}

export function UnitSprite({
	spriteBase,
	stance = UnitStance.IDLE,
	isHit = false,
}: UnitSpriteProps) {
	const src = `/sprites/${spriteBase}_${stance}.png`;

	return (
		<motion.div
			className={`
                        absolute inset-0 
                        flex items-center justify-center origin-bottom
                    `}
			animate={
				isHit
					? {
							filter: [
								"brightness(1)",
								"brightness(2) sepia(1) hue-rotate(-50deg) saturate(5)",
								"brightness(1)",
							],
							x: [0, -4, 4, -2, 0],
							rotate: [0, -3, 3, -1, 0],
							scale: [1, 1.05, 1.05, 1, 1],
						}
					: {}
			}
			transition={{ duration: 0.4, ease: "easeInOut" }}
		>
			<div className="absolute w-full h-full flex items-center justify-center pointer-events-none">
				<Image
					src={src}
					alt={`${spriteBase} stance ${stance}`}
					fill
					className="object-contain z-20"
					priority
				/>
			</div>
		</motion.div>
	);
}
