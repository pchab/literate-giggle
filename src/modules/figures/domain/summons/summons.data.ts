import type { Summon } from "../figures.type";
import { iceWall } from "./iceWall";

export const summonLibrary: Record<
	string,
	Omit<Summon, "id" | "gridPosition" | "allegiance" | "currentHp">
> = {
	ice_wall: iceWall,
};
