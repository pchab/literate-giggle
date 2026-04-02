"use client";

import { motion } from "motion/react";
import { useRef } from "react";

export const MotionCamera = ({
	children,
	background,
	dragDirection = "x",
}: {
	children: React.ReactNode;
	background: string;
	dragDirection?: "x" | "y" | true;
}) => {
	const constraintsRef = useRef<HTMLDivElement>(null);

	return (
		<div ref={constraintsRef} className="absolute inset-0 overflow-hidden">
			<motion.div
				drag={dragDirection}
				dragConstraints={constraintsRef}
				dragElastic={0.2}
				className="h-full min-w-full w-max cursor-grab active:cursor-grabbing flex items-center justify-center p-1"
				style={{
					backgroundImage: background,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				{children}
			</motion.div>
			<div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-black/40 to-transparent" />
			<div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-black/40 to-transparent" />
		</div>
	);
};
