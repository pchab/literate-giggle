import type {
	GridPosition,
	SurfaceData,
} from "@/modules/battle/domain/grid.type";
import type { BattleState } from "@/modules/battle/store/battle.store";
import type {
	Allegiance,
	UnitBlueprint,
} from "@/modules/units/domain/units.type";
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

	flavorText?: string;
	checkLoss?: (state: BattleState) => boolean;
	checkWin?: (state: BattleState) => boolean;
	objectiveText?: (progress: BattleState["objectiveProgress"]) => string;
	updateObjectives?: (
		state: BattleState,
	) => Promise<Partial<BattleState | undefined>>;

	onWinSceneId?: Scene["id"];
	onLoseSceneId?: Scene["id"];
	gridSize?: { cols: number; rows: number };
	startingPositions?: GridPosition[];
}

export function encounterId(id: string): Encounter["id"] {
	return `encounter-${id}` as Encounter["id"];
}
