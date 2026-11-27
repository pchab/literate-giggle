import { QUEST_DB } from "@/modules/campaign/data/quests.data";
import type { Quest, QuestStep } from "@/modules/campaign/domain/quests.type";
import { useCampaignStore } from "@/modules/campaign/store/campaign.store";
import { CLASS_REGISTRY } from "@/modules/units/data/heroClass.data";
import { WorldMapNodes } from "@/modules/world/data/mapNodes.data";
import { useWorldStore } from "@/modules/world/store/world.store";

export const SLOT_COUNT = 3;
const slotKey = (slot: number) => `alpha-save-slot-${slot}`;

/** Store data only (actions are dropped by the JSON round trip). */
type StoreData<T> = {
	[K in keyof T as T[K] extends (...args: never[]) => unknown
		? never
		: K]: T[K];
};
export type WorldData = StoreData<ReturnType<typeof useWorldStore.getState>>;
export type CampaignData = StoreData<
	ReturnType<typeof useCampaignStore.getState>
>;

export interface GameSnapshot {
	world: WorldData;
	campaign: CampaignData;
}

export interface SaveSlot extends GameSnapshot {
	version: string;
	savedAt: string;
	/** "Riverbend village", "Ironhold City"... */
	location: string;
	/** Log line of the first active quest step, or "No active quest". */
	objective: string;
	/** "Fighter 3 · Mage 2 · Hobo 5" */
	party: string;
}

const SAVE_VERSION = "0.1.0";

/** The current game, as plain data. */
export function snapshotGame(): GameSnapshot {
	return JSON.parse(
		JSON.stringify({
			world: useWorldStore.getState(),
			campaign: useCampaignStore.getState(),
		}),
	);
}

/** Replaces the current game with a snapshot (both stores persist themselves). */
export function restoreGame({ world, campaign }: GameSnapshot) {
	useWorldStore.setState(world);
	useCampaignStore.setState(campaign);
}

export function describeGame({ world, campaign }: GameSnapshot) {
	const location =
		WorldMapNodes[world.currentNodeId]?.name ?? world.currentNodeId;
	const [questId, stepId] = Object.entries(campaign.activeQuests)[0] ?? [];
	const step = questId
		? QUEST_DB[questId as Quest["id"]]?.steps[stepId as QuestStep["id"]]
		: undefined;
	const party = world.roster
		.map(
			(h) =>
				`${CLASS_REGISTRY[h.heroClass]?.name ?? h.heroClass} ${h.currentLevel}`,
		)
		.join(" · ");
	return {
		location,
		objective: step?.logDescription ?? "No active quest",
		party,
	};
}

export function readSlot(slot: number): SaveSlot | null {
	try {
		const raw = localStorage.getItem(slotKey(slot));
		return raw ? (JSON.parse(raw) as SaveSlot) : null;
	} catch {
		return null;
	}
}

export function readSlots(): (SaveSlot | null)[] {
	return Array.from({ length: SLOT_COUNT }, (_, i) => readSlot(i + 1));
}

export function saveToSlot(slot: number): SaveSlot {
	const snapshot = snapshotGame();
	const save: SaveSlot = {
		...snapshot,
		...describeGame(snapshot),
		version: SAVE_VERSION,
		savedAt: new Date().toISOString(),
	};
	localStorage.setItem(slotKey(slot), JSON.stringify(save));
	return save;
}

/** Loads a slot into the game. Returns false if the slot is empty. */
export function loadSlot(slot: number): boolean {
	const save = readSlot(slot);
	if (!save) return false;
	restoreGame(save);
	return true;
}

export function deleteSlot(slot: number) {
	localStorage.removeItem(slotKey(slot));
}

export function formatSavedAt(iso: string) {
	return new Date(iso).toLocaleString(undefined, {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});
}
