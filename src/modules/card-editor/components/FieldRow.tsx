export default function FieldRow({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center">
			<span className="w-1/3 text-xs font-semibold text-zinc-400">{label}</span>
			<div className="w-2/3">{children}</div>
		</div>
	);
}
