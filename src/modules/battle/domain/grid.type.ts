import type { Card } from "@/modules/cards/domain/cards.type";

export type GridPosition = {
	col: number;
	row: number;
};

export type SurfaceType = "TRAP" | "SPECIAL" | "HAZARD" | "TERRAIN" | "WALL";

export type SurfaceData = {
	id: string;
	type: SurfaceType;
	spriteBase: string;
	duration: number;

	gridPosition: GridPosition;
	size?: { cols: number; rows: number };

	charges?: number;
	onStep: Card;
	focalPoint?: BoundingBox;
};

export type BoundingBox = {
	gridPosition: GridPosition;
	size?: { cols: number; rows: number };
};

export type GridEntity = BoundingBox & { id: string };
