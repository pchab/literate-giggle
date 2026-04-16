"use client";

import Image from "next/image";
import { useShallow } from "zustand/shallow";
import { useBattleStore } from "@/modules/battle/store/battle.store";

export function SurfacesOverlay() {
	const { surfaces, gridSize } = useBattleStore(
		useShallow((state) => ({
			surfaces: state.surfaces,
			gridSize: state.gridSize,
		})),
	);

	return (
		<div
			className="absolute inset-0 grid gap-1 p-1 pointer-events-none z-5"
			style={{
				gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
				gridTemplateRows: `repeat(${gridSize.rows}, minmax(0, 1fr))`,
			}}
		>
			{Object.values(surfaces).map((surface) => {
				const cols = surface.size?.cols ?? 1;
				const rows = surface.size?.rows ?? 1;

				return (
					<div
						key={surface.id}
						className="relative flex items-center justify-center w-full h-full overflow-visible pointer-events-none"
						style={{
							gridColumn: `${surface.gridPosition.col + 1} / span ${cols}`,
							gridRow: `${surface.gridPosition.row + 1} / span ${rows}`,
						}}
					>
						<Image
							src={surface.spriteBase}
							alt={surface.type}
							width={0}
							height={0}
							sizes="100vw"
							style={{
								width: "auto",
								height: "100%",
								maxWidth: "150%",
							}}
							className="mix-blend-screen"
						/>
					</div>
				);
			})}
		</div>
	);
}
