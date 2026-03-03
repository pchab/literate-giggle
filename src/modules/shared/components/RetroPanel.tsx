// components/ui/RetroPanel.tsx
import { type HTMLMotionProps, motion } from "motion/react";
import { forwardRef } from "react";

interface RetroPanelProps
	extends Omit<HTMLMotionProps<"div">, "ref" | "children"> {
	title?: string;
	children?: React.ReactNode;
}

export const RetroPanel = forwardRef<HTMLDivElement, RetroPanelProps>(
	({ children, className = "", title, ...props }, ref) => {
		return (
			<motion.div
				ref={ref}
				className={`gothic-panel rounded-sm p-8 relative ${className}`}
				{...props}
			>
				{title && (
					<div className="absolute -top-4 left-6 bg-zinc-900 border border-zinc-600 px-6 py-1 font-pixel text-xl tracking-widest text-shadow-pixel text-zinc-100 shadow-[0_4px_6px_rgba(0,0,0,0.8)] rounded-sm z-10">
						{title}
					</div>
				)}
				{children}
			</motion.div>
		);
	},
);

RetroPanel.displayName = "RetroPanel";
