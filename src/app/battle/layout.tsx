export default function RootBattleLayout({
	children,
	party,
	enemyIntent,
}: Readonly<{
	children: React.ReactNode;
	party: React.ReactNode;
	enemyIntent: React.ReactNode;
}>) {
	return (
		<>
			<aside className="flex flex-col justify-end gap-4 p-4 w-125 border-r-2 border-stone-800/50 shadow-2xl bg-radial from-zinc-700 to-grey-800">
				{party}
				<div className="w-98 h-px bg-linear-to-b from-transparent via-zinc-700 to-transparent" />
				{enemyIntent}
			</aside>

			<main className="flex-1 relative">{children}</main>
		</>
	);
}
