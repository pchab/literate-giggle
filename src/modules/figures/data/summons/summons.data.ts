import type { Summon } from "../../domain/figures.type";
import { skeleton } from "../monsters/skeleton.data";
import { iceWall } from "./iceWall";

export const summonLibrary: Record<
	string,
	Omit<Summon, "id" | "gridPosition" | "allegiance" | "currentHp">
> = {
	ice_wall: iceWall,
	skeleton: {
		...skeleton,
		summonType: skeleton.enemyType,
	},
};
