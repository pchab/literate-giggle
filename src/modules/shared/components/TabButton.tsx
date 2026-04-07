export function TabButton({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`text-left px-4 py-2 rounded font-semibold transition-colors ${
				active
					? "bg-zinc-800 text-blue-400 border border-zinc-700"
					: "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
			}`}
		>
			{children}
		</button>
	);
}
