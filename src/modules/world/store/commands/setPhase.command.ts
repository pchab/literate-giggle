import type {
	GamePhase,
	WorldStoreServerAction,
} from "@/modules/world/store/world.store";

export function setPhase(phase: GamePhase): WorldStoreServerAction {
	return () => ({ phase });
}
