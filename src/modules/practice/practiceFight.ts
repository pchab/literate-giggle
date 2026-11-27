import { useBattleStore } from "@/modules/battle/store/battle.store";
import { SCENE_DB } from "@/modules/campaign/data/scenes.data";
import type { SceneAction } from "@/modules/campaign/domain/scenes.type";
import {
	type GameSnapshot,
	restoreGame,
	snapshotGame,
} from "@/modules/saves/saveSlots";
import type { Hero } from "@/modules/units/domain/units.type";
import { WorldMapNodes } from "@/modules/world/data/mapNodes.data";
import { useWorldStore } from "@/modules/world/store/world.store";

const SESSION_KEY = "alpha-practice-fight";
export const FIGHT_ROOM_PATH = "/dev/fights";

interface PracticeSession {
	encounterId: string;
	/** The real game, restored when the practice fight ends. */
	snapshot: GameSnapshot;
}

export interface PracticeResult {
	encounterId: string;
	outcome: "VICTORY" | "DEFEAT";
	/** Each hero's HP at the end: [name, hp, maxHp]. */
	heroes: [string, number, number][];
}

export function getPracticeSession(): PracticeSession | null {
	if (typeof window === "undefined") return null;
	try {
		return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null");
	} catch {
		return null;
	}
}

/**
 * Starts a fight outside the campaign: the current game is set aside, the party
 * replaces the roster, and the battle opens. Nothing from the fight is kept.
 * Returns the battle URL to navigate to.
 */
export function startPracticeFight(
	encounterId: string,
	background: string,
	party: Hero[],
): string {
	const existing = getPracticeSession();
	const session: PracticeSession = {
		encounterId,
		// A fight started from the room while another was abandoned keeps the original game.
		snapshot: existing?.snapshot ?? snapshotGame(),
	};
	sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
	sessionStorage.removeItem(`${SESSION_KEY}-result`);
	sessionStorage.removeItem("alpha-battle-state");
	useBattleStore.setState({
		encounterId: null,
		units: [],
		battleStatus: "ONGOING",
	});
	useWorldStore.setState({
		roster: party.map((h) => ({ ...h, currentHp: h.maxHp })),
		phase: "BATTLE",
	});
	return `/battle/${encounterId}?background=${background}`;
}

/** Ends a practice fight: restores the real game and records the result for the room. */
export function finishPracticeFight(
	outcome: PracticeResult["outcome"],
): string {
	const session = getPracticeSession();
	const heroes = useBattleStore
		.getState()
		.units.filter((u) => u.id.startsWith("hero-"))
		.map(
			(u) =>
				[u.name, Math.max(0, u.currentHp), u.maxHp] as [string, number, number],
		);
	if (session) restoreGame(session.snapshot);
	sessionStorage.removeItem(SESSION_KEY);
	const result: PracticeResult = {
		encounterId: session?.encounterId ?? "",
		outcome,
		heroes,
	};
	sessionStorage.setItem(`${SESSION_KEY}-result`, JSON.stringify(result));
	return FIGHT_ROOM_PATH;
}

/** Leaves a practice fight early (from the room): restores the real game. */
export function abandonPracticeFight() {
	const session = getPracticeSession();
	if (session) restoreGame(session.snapshot);
	sessionStorage.removeItem(SESSION_KEY);
}

/** The last practice fight's result (kept until the next practice fight starts). */
export function readPracticeResult(): PracticeResult | null {
	try {
		const raw = sessionStorage.getItem(`${SESSION_KEY}-result`);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

/**
 * Where each encounter is fought in the campaign (its battle background), from the
 * scenes that start it and the map nodes that hold it.
 */
export function encounterBackgrounds(): Record<string, string> {
	const found: Record<string, string> = {};
	const visit = (actions: SceneAction[] | undefined) => {
		for (const a of actions ?? []) {
			if (a.type === "START_BATTLE") found[a.encounterId] ??= a.background;
			if (a.type === "IF_FLAGS") {
				visit(a.actions);
				visit(a.otherwise);
			}
		}
	};
	for (const scene of Object.values(SCENE_DB)) {
		for (const step of Object.values(scene.steps)) {
			visit(step.onNext);
			visit(step.onEnter);
			for (const c of step.choices ?? []) visit(c.actions);
		}
	}
	for (const node of Object.values(WorldMapNodes)) {
		if (node.encounterId && node.background)
			found[node.encounterId] ??= node.background;
		for (const v of node.variants ?? []) {
			const o = v.override;
			if (o.encounterId && o.background) found[o.encounterId] ??= o.background;
		}
	}
	return found;
}
