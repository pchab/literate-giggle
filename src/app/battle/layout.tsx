export default function RootLayout({
	children,
	party,
	enemy,
}: Readonly<{
	children: React.ReactNode;
	party: React.ReactNode;
	enemy: React.ReactNode;
}>) {
	return (
		<>
			{/* Left Column: Party Sidebar */}
			<aside className="w-[500px] flex-shrink-0 border-r border-zinc-800 bg-zinc-900 p-4">
				{party}
			</aside>

			{/* Center Column: Main Battle Grid */}
			<main className="flex-1 relative">{children}</main>

			{/* Right Column: Enemy Area */}
			<aside className="w-80 flex-shrink-0 border-l border-zinc-800 bg-zinc-900 p-4">
				{enemy}
			</aside>
		</>
	);
}
