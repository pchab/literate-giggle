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
			<aside className="flex flex-col gap-4 p-4 w-[clamp(400px,38vw,500px)] shrink-0 overflow-y-auto [&>*:first-child]:mt-auto border-r-2 border-stone-800/50 shadow-2xl bg-radial from-zinc-700 to-grey-800">
				<ObjectiveTracker />
				{party}
				<div className="w-full max-w-98 h-px shrink-0 bg-linear-to-b from-transparent via-zinc-700 to-transparent" />

				<div className="h-48 min-[1100px]:h-64 shrink-0 relative">
					<AnimatePresence mode="wait">{unitInspector}</AnimatePresence>
				</div>
			</aside>

			<main className="flex-1 relative">{children}</main>
		</>
	);
}
