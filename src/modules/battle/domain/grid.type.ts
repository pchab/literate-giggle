export type GridPosition = {
	col: number;
	row: number;
};

export type SurfaceType = "MAGMA" | "TRAP" | "ICE" | "MUD";

export type SurfaceData = {
  position: GridPosition;
  type: SurfaceType;
  duration: number;
  damage?: number;
  spriteBase: string;
};

