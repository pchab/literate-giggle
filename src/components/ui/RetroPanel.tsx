import { type HTMLMotionProps, motion } from "motion/react";
import React from "react";

interface RetroPanelProps
	extends Omit<HTMLMotionProps<"div">, "ref" | "children"> {
	title?: string;
	children?: React.ReactNode;
}

export const RetroPanel = React.forwardRef<HTMLDivElement, RetroPanelProps>(
	({ children, className = "", title, ...props }, ref) => {
		return (
			<motion.div
				ref={ref}
				className={`bg-slate-900 border-4 border-slate-700 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.1),6px_6px_0px_0px_rgba(0,0,0,0.6)] text-slate-200 p-8 relative ${className}`}
				{...props}
			>
				{title && (
					<div className="absolute -top-5 left-4 bg-slate-800 border-2 border-slate-600 px-4 py-1 font-pixel text-2xl tracking-widest text-shadow-pixel text-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]">
						{title}
					</div>
				)}
				{children}
			</motion.div>
		);
	},
);

RetroPanel.displayName = "RetroPanel";
