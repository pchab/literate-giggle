// components/ui/RetroButton.tsx
import { type HTMLMotionProps, motion } from "motion/react";
import { forwardRef } from "react";

interface RetroButtonProps
	extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
	variant?: "default" | "primary" | "warning";
	children?: React.ReactNode;
}

export const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>(
	({ children, className = "", variant = "default", ...props }, ref) => {
		// Switched from chunky 4px shadows to a sharp, modern 3D push effect
		const baseClasses =
			"font-pixel tracking-widest uppercase transition-all border px-2 py-1 text-lg rounded-sm active:translate-y-1 active:shadow-[0_0_0_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed";

		const variants = {
			// Dark Stone
			default:
				"bg-zinc-800 border-zinc-600 text-zinc-200 shadow-[0_4px_0_rgba(0,0,0,1)] hover:bg-zinc-700 hover:text-white hover:border-zinc-400",
			// Dark Magic / Crimson
			primary:
				"bg-red-950 border-red-800 text-red-100 shadow-[0_4px_0_rgba(0,0,0,1)] hover:bg-red-900 hover:border-red-500 hover:text-white",
			// Gold / Ember
			warning:
				"bg-amber-900 border-amber-700 text-amber-50 shadow-[0_4px_0_rgba(0,0,0,1)] hover:bg-amber-800 hover:border-amber-400 hover:text-white",
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
	},
);

RetroButton.displayName = "RetroButton";
