import { AnimatePresence } from "motion/react";
import { ObjectiveTracker } from "@/modules/campaign/components/ObjectiveTracker";

export default function RootBattleLayout({
	children,
	party,
	unitInspector,
}: Readonly<{
	children: React.ReactNode;
	party: React.ReactNode;
	unitInspector: React.ReactNode;
}>) {
	return (
		<>
			<aside className="flex flex-col justify-end gap-4 p-4 w-125 border-r-2 border-stone-800/50 shadow-2xl bg-radial from-zinc-700 to-grey-800">
				<ObjectiveTracker />
				{party}
				<div className="w-98 h-px bg-linear-to-b from-transparent via-zinc-700 to-transparent" />

				<div className="h-64 relative">
					<AnimatePresence mode="wait">{unitInspector}</AnimatePresence>
				</div>
			</aside>

			<main className="flex-1 relative">{children}</main>
		</>
	);
}
