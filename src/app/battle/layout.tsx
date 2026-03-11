export default function RootBattleLayout({
	children,
	party,
}: Readonly<{
	children: React.ReactNode;
	party: React.ReactNode;
}>) {
	return (
		<>
			<aside
				className="relative flex flex-col gap-4 p-4 w-125 border-r-2 border-amber-900/50 shadow-2xl"
				style={{
					backgroundImage: `linear-gradient(to bottom, rgba(24, 24, 27, 0.85), rgba(9, 9, 11, 0.95)), url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%233f3f46' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E")`,
				}}
			>
				<div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-0" />

				{party}
			</aside>

			<main className="flex-1 relative">{children}</main>
		</>
	);
}
