import type { Status } from "@/modules/units/domain/status.type";

export type GridPosition = {
	col: number;
	row: number;
};

export type SurfaceType = "TRAP" | "SPECIAL" | "HAZARD" | "TERRAIN" | "WALL";

export type SurfaceData = {
	id: string;
	type: SurfaceType;

	gridPosition: GridPosition;
	size?: { cols: number; rows: number };

	duration: number;
	damage?: number;
	spriteBase: string;
	status?: Status;
	charges?: number;
};

export type BoundingBox = {
	gridPosition: GridPosition;
	size?: { cols: number; rows: number };
};
