import { type HTMLMotionProps, motion } from "motion/react";
import React from "react";

interface RetroButtonProps
	extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
	variant?: "default" | "primary" | "warning";
	children?: React.ReactNode;
}

export const RetroButton = React.forwardRef<
	HTMLButtonElement,
	RetroButtonProps
>(({ children, className = "", variant = "default", ...props }, ref) => {
	const baseClasses =
		"font-pixel tracking-widest uppercase transition-colors shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2),_4px_4px_0px_0px_rgba(0,0,0,0.7)] border-2 border-black px-6 py-2 text-white text-xl active:translate-y-1 active:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2),_0px_0px_0px_0px_rgba(0,0,0,0.7)] disabled:opacity-50 disabled:cursor-not-allowed";

	const variants = {
		default: "bg-slate-700 hover:bg-slate-600",
		primary: "bg-blue-700 hover:bg-blue-600",
		warning: "bg-yellow-600 hover:bg-yellow-500 text-yellow-50",
	};

	return (
		<motion.button
			ref={ref}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className={`${baseClasses} ${variants[variant]} ${className}`}
			{...props}
		>
			<span className="text-shadow-pixel">{children}</span>
		</motion.button>
	);
});

RetroButton.displayName = "RetroButton";
