import type { Summon } from "../../domain/figures.type";
import { briarWolf } from "../monsters/briar-wolf";
import { skeleton } from "../monsters/skeleton.data";
import { iceWall } from "./iceWall";

export const summonLibrary: Record<
	string,
	Omit<
		Summon,
		"id" | "gridPosition" | "allegiance" | "currentHp" | "currentBlock"
	>
> = {
	ice_wall: iceWall,
	skeleton,
	briar_wolf: briarWolf,
};
