"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { alchemistEncounters } from "@/modules/campaign/data/alchemists-ledger/alchemistsLedger.encounters";
import { DWARVEN_PASSAGE_ENCOUNTER_DB } from "@/modules/campaign/data/dwarven-passage/dwarvenPassage.encounters";
import { NECROMANCER_ENCOUNTER_DB } from "@/modules/campaign/data/necromancer/necromancer.encounters";
import { RATS_IN_THE_CELLAR_ENCOUNTERS } from "@/modules/campaign/data/rats-in-the-cellar/ratsInTheCellar.encounters";
import { sewerContaminationEncounters } from "@/modules/campaign/data/sewer-contamination/sewerContamination.encounters";
import { SHADOWS_DEBT_ENCOUNTERS } from "@/modules/campaign/data/shadows-debt/shadowsDebt.encounters";
import { VERDANT_RECLAMATION_ENCOUNTER_DB } from "@/modules/campaign/data/verdant-reclamation/verdantReclamation.encounters";
import type { Encounter } from "@/modules/campaign/domain/encounters.type";
import { getComputedCard } from "@/modules/cards/helpers/cards.helper";
import {
	buildPresetHero,
	CLASS_PATHS,
	type HeroPreset,
	maxPresetLevel,
} from "@/modules/practice/partyBuilder";
import {
	abandonPracticeFight,
	encounterBackgrounds,
	getPracticeSession,
	type PracticeResult,
	startPracticeFight,
	readPracticeResult,
} from "@/modules/practice/practiceFight";
import { readSlots, type SaveSlot } from "@/modules/saves/saveSlots";
import { RetroButton } from "@/modules/shared/components/RetroButton";
import { CLASS_REGISTRY } from "@/modules/units/data/heroClass.data";
import type { HeroClass } from "@/modules/units/domain/heroClass.types";
import type { Hero } from "@/modules/units/domain/units.type";
import { initializeRoster } from "@/modules/world/store/commands/initializeRoster.command";
import { useWorldStore } from "@/modules/world/store/world.store";

const QUEST_GROUPS: [string, Record<string, Encounter>][] = [
	["Rats in the Cellar", RATS_IN_THE_CELLAR_ENCOUNTERS],
	["The Alchemist's Ledger", alchemistEncounters],
	["The Ironhold Sump", sewerContaminationEncounters],
	["The Archmage's Price", NECROMANCER_ENCOUNTER_DB],
	["The Sealed Passage", DWARVEN_PASSAGE_ENCOUNTER_DB],
	["The Shadow's Debt", SHADOWS_DEBT_ENCOUNTERS],
	["The Verdant Reclamation", VERDANT_RECLAMATION_ENCOUNTER_DB],
];

const QUICK_PRESETS: [string, HeroPreset[]][] = [
	[
		"New game",
		[
			{ heroClass: "HOBO", level: 1 },
			{ heroClass: "HOBO", level: 1 },
			{ heroClass: "HOBO", level: 1 },
		],
	],
	[
		"Hobos Lv 5",
		[
			{ heroClass: "HOBO", level: 5 },
			{ heroClass: "HOBO", level: 5 },
			{ heroClass: "HOBO", level: 5 },
		],
	],
	[
		"Fighter · Mage · Cleric Lv 3",
		[
			{ heroClass: "FIGHTER", level: 3 },
			{ heroClass: "MAGE", level: 3 },
			{ heroClass: "CLERIC", level: 3 },
		],
	],
	[
		"Rogue · Archer · Cleric Lv 5",
		[
			{ heroClass: "ROGUE", level: 5 },
			{ heroClass: "ARCHER", level: 5 },
			{ heroClass: "CLERIC", level: 5 },
		],
	],
	[
		"Knight · Pyromancer · Cleric Lv 3",
		[
			{ heroClass: "KNIGHT", level: 3 },
			{ heroClass: "PYROMANCER", level: 3 },
			{ heroClass: "CLERIC", level: 3 },
		],
	],
];

const ALL_CLASSES = Object.keys(CLASS_PATHS) as HeroClass[];

type PartySource = "game" | "preset" | `slot-${number}`;

/**
 * Dev fight room: start any encounter with any party, outside the campaign.
 * The real game is set aside during the fight and restored afterwards.
 */
export default function FightRoom() {
	const router = useRouter();
	const [source, setSource] = useState<PartySource>("preset");
	const [presets, setPresets] = useState<HeroPreset[]>(QUICK_PRESETS[2][1]);
	const [slots, setSlots] = useState<(SaveSlot | null)[]>([]);
	const [gameRoster, setGameRoster] = useState<Hero[]>([]);
	const [result, setResult] = useState<PracticeResult | null>(null);

	useEffect(() => {
		// Coming back from an abandoned practice fight (browser back): restore the game.
		if (getPracticeSession()) abandonPracticeFight();
		setResult(readPracticeResult());
		setSlots(readSlots());
		setGameRoster(useWorldStore.getState().roster);
	}, []);

	const backgrounds = useMemo(() => encounterBackgrounds(), []);

	const party: Hero[] = useMemo(() => {
		if (source === "game") return gameRoster;
		if (source.startsWith("slot-")) {
			return slots[Number(source.slice(5)) - 1]?.world.roster ?? [];
		}
		const fresh = initializeRoster()(useWorldStore.getState()).roster ?? [];
		return fresh.map((hero, i) => buildPresetHero(hero, presets[i]));
	}, [source, presets, slots, gameRoster]);

	const fight = (encounterId: string) => {
		if (!party.length) return;
		const background = backgrounds[encounterId] ?? "plain";
		router.push(startPracticeFight(encounterId, background, party));
	};

	const setPreset = (i: number, change: Partial<HeroPreset>) =>
		setPresets((prev) =>
			prev.map((p, j) => {
				if (j !== i) return p;
				const next = { ...p, ...change };
				return {
					...next,
					level: Math.min(next.level, maxPresetLevel(next.heroClass)),
				};
			}),
		);

	return (
		<main className="h-screen w-screen overflow-y-auto bg-zinc-950 text-zinc-300 p-8 font-mono">
			<header className="flex items-baseline justify-between mb-6">
				<h1 className="text-4xl font-pixel text-yellow-500 uppercase tracking-widest">
					Fight Room
				</h1>
				<Link
					href="/start"
					className="text-xs uppercase tracking-widest text-zinc-500 hover:text-amber-400"
				>
					Back to title
				</Link>
			</header>
			<p className="text-sm text-zinc-500 mb-6 max-w-3xl">
				Start any fight with any party. Nothing from these fights is kept: your
				game is set aside while you fight and comes back when the fight ends.
			</p>

			{result && (
				<div
					role="status"
					className={`mb-6 border-2 px-4 py-3 text-sm ${result.outcome === "VICTORY" ? "border-emerald-700 bg-emerald-950/50 text-emerald-300" : "border-red-800 bg-red-950/50 text-red-300"}`}
				>
					<strong className="uppercase tracking-widest">
						{result.outcome === "VICTORY" ? "Victory" : "Defeat"}
					</strong>{" "}
					· {findEncounter(result.encounterId)?.name ?? result.encounterId} ·{" "}
					{result.heroes
						.map(([name, hp, max]) => `${name} ${hp}/${max}`)
						.join(", ")}
					<button
						type="button"
						onClick={() => fight(result.encounterId)}
						className="ml-4 underline hover:text-white"
					>
						Fight again
					</button>
				</div>
			)}

			<div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-8">
				<section aria-label="Encounters" className="flex flex-col gap-6">
					{QUEST_GROUPS.map(([title, db]) => (
						<div key={title}>
							<h2 className="text-amber-500 font-pixel text-xl uppercase tracking-widest mb-2">
								{title}
							</h2>
							<ul className="flex flex-col gap-1">
								{Object.values(db).map((enc) => {
									const monsters = summarizeMonsters(enc);
									const isBoss = monsters.some((m) => m.hint);
									return (
										<li
											key={enc.id}
											className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-3 py-2"
										>
											<span
												className={`text-xs px-1.5 py-0.5 uppercase ${isBoss ? "bg-red-900 text-red-200" : "bg-zinc-800 text-zinc-400"}`}
											>
												{isBoss ? "Boss" : "Fight"}
											</span>
											<div className="flex-1 min-w-0">
												<p className="text-zinc-100 text-sm font-bold">
													{enc.name}
												</p>
												<p className="text-zinc-500 text-xs truncate">
													{monsters
														.map((m) =>
															m.count > 1 ? `${m.count}× ${m.name}` : m.name,
														)
														.join(", ")}
												</p>
											</div>
											<RetroButton
												onClick={() => fight(enc.id)}
												aria-label={`Fight ${enc.name}`}
												disabled={!party.length}
											>
												Fight
											</RetroButton>
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</section>

				<section
					aria-label="Party"
					className="flex flex-col gap-4 xl:sticky xl:top-8 self-start"
				>
					<h2 className="text-amber-500 font-pixel text-xl uppercase tracking-widest">
						Party
					</h2>
					<label className="flex flex-col gap-1 text-xs uppercase tracking-widest text-zinc-500">
						Party from
						<select
							value={source}
							onChange={(e) => setSource(e.target.value as PartySource)}
							className="bg-zinc-900 border border-zinc-700 text-zinc-100 px-2 py-2 normal-case tracking-normal text-sm"
						>
							<option value="preset">A preset (pick classes and levels)</option>
							{gameRoster.length > 0 && (
								<option value="game">Your current game</option>
							)}
							{slots.map((s, i) =>
								s ? (
									<option key={s.savedAt} value={`slot-${i + 1}`}>
										Save slot {i + 1}: {s.party}
									</option>
								) : null,
							)}
						</select>
					</label>

					{source === "preset" && (
						<div className="flex flex-col gap-3">
							<div className="flex flex-wrap gap-2">
								{QUICK_PRESETS.map(([label, value]) => (
									<button
										key={label}
										type="button"
										onClick={() => setPresets(value)}
										className="text-xs border border-zinc-700 px-2 py-1 hover:border-amber-500 hover:text-amber-400"
									>
										{label}
									</button>
								))}
							</div>
							{presets.map((p, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: three fixed party slots
								<div key={i} className="flex gap-2">
									<select
										aria-label={`Hero ${i + 1} class`}
										value={p.heroClass}
										onChange={(e) =>
											setPreset(i, { heroClass: e.target.value as HeroClass })
										}
										className="flex-1 bg-zinc-900 border border-zinc-700 text-zinc-100 px-2 py-1 text-sm"
									>
										{ALL_CLASSES.map((c) => (
											<option key={c} value={c}>
												{CLASS_REGISTRY[c].name}
											</option>
										))}
									</select>
									<select
										aria-label={`Hero ${i + 1} level`}
										value={p.level}
										onChange={(e) =>
											setPreset(i, { level: Number(e.target.value) })
										}
										className="w-24 bg-zinc-900 border border-zinc-700 text-zinc-100 px-2 py-1 text-sm"
									>
										{levelsOf(p.heroClass).map((level) => (
											<option key={level} value={level}>
												Lv {level}
											</option>
										))}
									</select>
								</div>
							))}
							<p className="text-xs text-zinc-600">
								Presets level up like a player would: first card or passive
								offered, a +1 rune on the first card in hand.
							</p>
						</div>
					)}

					<ul className="flex flex-col gap-2" aria-label="Party members">
						{party.map((h) => (
							<li
								key={h.id}
								className="bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs"
							>
								<p className="text-zinc-100 text-sm font-bold">
									{h.name} · {CLASS_REGISTRY[h.heroClass]?.name}{" "}
									{h.currentLevel}
								</p>
								<p className="text-zinc-400">
									HP {h.maxHp} · DEF {h.baseDef} · Move {h.baseMove}
									{h.passives.length > 0 &&
										` · ${h.passives.length} passive${h.passives.length > 1 ? "s" : ""}`}
								</p>
								<p className="text-zinc-500 truncate">
									{h.selectedCards
										.filter((c) => c !== null)
										.map((c) => getComputedCard(c).name)
										.join(", ")}
								</p>
							</li>
						))}
					</ul>
				</section>
			</div>
		</main>
	);
}

function levelsOf(heroClass: HeroClass) {
	return Array.from({ length: maxPresetLevel(heroClass) }, (_, i) => i + 1);
}

function findEncounter(id: string) {
	for (const [, db] of QUEST_GROUPS) if (db[id]) return db[id];
	return undefined;
}

function summarizeMonsters(enc: Encounter) {
	const counts = new Map<
		string,
		{ name: string; count: number; hint?: string }
	>();
	for (const m of enc.generateMonsters()) {
		const entry = counts.get(m.name) ?? {
			name: m.name,
			count: 0,
			hint: m.hint,
		};
		entry.count++;
		counts.set(m.name, entry);
	}
	return [...counts.values()];
}
