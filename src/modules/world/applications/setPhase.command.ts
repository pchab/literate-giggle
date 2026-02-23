import type { GamePhase, WorldStoreServerAction } from "@/store/world.store";

export function setPhase(phase: GamePhase): WorldStoreServerAction {
	return () => ({ phase });
}
