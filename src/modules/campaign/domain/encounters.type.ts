import type { Monster } from "@/modules/figures/domain/figures.type";
import type { Scene } from "./scenes.type";

export interface Encounter {
	id: string & { __brand: "EncounterId" };
	name: string;
	generateMonsters: () => Monster[];
	onWinSceneId?: Scene["id"];
	onLoseSceneId?: Scene["id"];
}

export function encounterId(id: string): Encounter["id"] {
	return `encounter-${id}` as Encounter["id"];
}
