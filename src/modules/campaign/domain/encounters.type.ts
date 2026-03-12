import type {
	GridPosition,
	SurfaceData,
} from "@/modules/battle/domain/grid.type";
import type {
	Allegiance,
	UnitBlueprint,
} from "@/modules/figures/domain/figures.type";
import type { Scene } from "./scenes.type";

export interface Encounter {
	id: string & { __brand: "EncounterId" };
	name: string;
	generateMonsters: () => (UnitBlueprint & { gridPosition: GridPosition })[];
	generateSummons?: () => (UnitBlueprint & {
		gridPosition: GridPosition;
		allegiance: Allegiance;
	})[];
	surfaces?: Record<string, SurfaceData>;
	onWinSceneId?: Scene["id"];
	onLoseSceneId?: Scene["id"];
}

export function encounterId(id: string): Encounter["id"] {
	return `encounter-${id}` as Encounter["id"];
}
