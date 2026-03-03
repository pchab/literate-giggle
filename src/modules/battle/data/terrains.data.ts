import type { TerrainType } from "../domain/grid.type";

export const terrainImageMapping: Record<TerrainType, string> = {
	GRASS: "/terrains/grass.jpg",
	FOREST: "/terrains/forest.jpg",
	MOUNTAIN: "/terrains/mountain.jpg",
	RUINS: "/terrains/desert_ruins.jpg",
	CITY: "/terrains/city.jpg",
	DUNGEON: "/terrains/dungeon.jpg",
};
