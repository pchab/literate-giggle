import { STATUS_INFO } from "@/modules/units/data/statusInfo.data";
import type { Status } from "@/modules/units/domain/status.type";

export function StatusChip({ status }: { status: Status }) {
	const info = STATUS_INFO[status.type];
	const turns =
		status.duration === -1
			? "Lasts until removed."
			: `${status.duration} turn${status.duration > 1 ? "s" : ""} left.`;

	return (
		<span
			title={`${info.label}: ${info.description} ${turns}`}
			className={`text-xs bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700 flex items-center gap-1 cursor-help ${info.color}`}
		>
			{info.icon} {info.label} {status.amount > 0 && status.amount}
		</span>
	);
}
