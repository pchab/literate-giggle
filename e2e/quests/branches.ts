import type { BotScript } from "../support/bot";
import type { Setup } from "../support/state";

export const Q = {
	rats: "quest-rat_in_the_cellar",
	ledger: "quest-the_alchemists_ledger",
	sump: "quest-ironhold_sump",
	necro: "quest-necromancer",
	dwarves: "quest-dwarven_highway",
	vane: "quest-shadows_debt",
	verdant: "quest-verdant_reclamation",
} as const;

export interface Expect {
	flags?: string[];
	noFlags?: string[];
	/** Quests that must be complete (the branch's own quest always is). */
	completed?: string[];
	/** Quest id -> active step id. */
	step?: Record<string, string>;
	runes?: string[];
	noRunes?: string[];
	/** Map node the party ends on. */
	node?: string;
	/** Encounters that must not be fought. */
	notFought?: string[];
	/** Encounter id -> monster name -> count (first time it is fought). */
	monsters?: Record<string, Record<string, number>>;
	/** Every hero's HP when the first battle starts. */
	hpAtFirstBattle?: number;
}

export interface Branch extends BotScript {
	name: string;
	quest: string;
	setup?: Setup;
	expect: Expect;
}

const LEDGER_START: Setup = {
	active: { [Q.ledger]: "quest-step-meet_barnaby" },
	completed: [Q.rats],
};
const SUMP_START: Setup = {
	active: { [Q.sump]: "quest-step-sump_investigate" },
	completed: [Q.rats, Q.ledger],
};
const NECRO_START: Setup = { active: { [Q.necro]: "quest-step-visit_tower" } };
const DWARF_START: Setup = {
	active: { [Q.dwarves]: "quest-step-visit_prospector" },
};
const VANE_START: Setup = { active: { [Q.vane]: "quest-step-speak_to_vane" } };
const VERDANT_START: Setup = {
	active: { [Q.verdant]: "quest-step-war_rumors" },
};

const FIGHT_BARNABY = ["Consider it done", "This isn't medicine", "We read it"];
const TOAD_TO_RIVERBEND = [
	"Brace yourselves",
	"Inspect the damage",
	"Rush to Riverbend",
	"Begin: Riverbend",
	"Rush into the village",
];
const TOAD_TO_DEN = [
	"Brace yourselves",
	"Inspect the damage",
	"Let Riverbend fend",
	"Begin: The Smuggler",
];
const VANE_JOB = [
	"looking for work",
	"A wolf made of thorns",
	"Draw your steel",
];
const VANE_REWARD = [
	"Clean the sigil",
	"Here is your family's sigil",
	"I'm ready",
];
const DEFEND_SIEGE = [
	"Push them back",
	"Go deeper",
	"Defend the tavern",
	"Leave the tavern",
	"Defend the king",
	"Take the Iron rune",
];
const ASSAULT_SIEGE = [
	"Charge!",
	"Go deeper",
	"Assault the taproom",
	"Leave the tavern",
	"Your reign ends",
	"Take the Nature rune",
];

export const BRANCHES: Branch[] = [
	// ------------------------------------------------ Rats in the Cellar (from New Game)
	{
		name: "rats: win both fights, seal the trapdoor",
		quest: Q.rats,
		choices: ["Nail it shut"],
		expect: {
			flags: ["cellar_sealed"],
			step: { [Q.ledger]: "quest-step-meet_barnaby" },
			runes: ["rune_pestilence"],
		},
	},
	{
		name: "rats: win both fights, leave the tunnel open",
		quest: Q.rats,
		choices: ["Leave it."],
		expect: { flags: ["cellar_tunnel_open"], noFlags: ["cellar_sealed"] },
	},
	{
		name: "rats: lose to the mob, accept, one more try, win",
		quest: Q.rats,
		choices: ["One more try", "Nail it shut"],
		battles: { "encounter-rat_mob": ["lose", "win"] },
		expect: { flags: ["cellar_sealed"], runes: ["rune_pestilence"] },
	},
	{
		name: "rats: lose to the mob, accept, smoke them out",
		quest: Q.rats,
		choices: ["Smoke them out"],
		battles: { "encounter-rat_mob": ["lose"] },
		expect: {
			flags: ["rusty_boar_smoked"],
			step: { [Q.ledger]: "quest-step-meet_barnaby" },
			noRunes: ["rune_pestilence"],
		},
	},
	{
		name: "rats: lose to the King, accept, chase it, win",
		quest: Q.rats,
		choices: ["After it!", "Leave it."],
		battles: { "encounter-rat_boss": ["lose", "win"] },
		expect: { flags: ["cellar_tunnel_open"], noFlags: ["rat_king_escaped"] },
	},
	{
		name: "rats: lose to the King, accept, collapse the tunnel",
		quest: Q.rats,
		choices: ["Collapse the tunnel"],
		battles: { "encounter-rat_boss": ["lose"] },
		expect: {
			flags: ["rat_king_escaped", "cellar_sealed"],
			step: { [Q.ledger]: "quest-step-meet_barnaby" },
		},
	},
	{
		name: "rats: lose to the mob, Try again, win",
		quest: Q.rats,
		choices: ["Nail it shut"],
		battles: { "encounter-rat_mob": ["lose", "win"] },
		defeat: ["Try again"],
		expect: { flags: ["cellar_sealed"] },
	},
	{
		name: "rats: lose to the mob, Retreat, come back, win",
		quest: Q.rats,
		choices: ["Nail it shut"],
		battles: { "encounter-rat_mob": ["lose", "win"] },
		defeat: ["Retreat"],
		expect: { flags: ["cellar_sealed"] },
	},

	// ------------------------------------------------ The Alchemist's Ledger
	{
		name: "ledger: fight Barnaby, jail him",
		quest: Q.ledger,
		setup: LEDGER_START,
		choices: [...FIGHT_BARNABY, "Drag him out"],
		expect: {
			flags: ["barnaby_jailed"],
			noFlags: ["mutagen_spreading"],
			runes: ["rune_acid"],
			step: { [Q.sump]: "quest-step-sump_investigate" },
		},
	},
	{
		name: "ledger: [Mage] pushes, mercenary, dare, let the acid take him",
		quest: Q.ledger,
		setup: { ...LEDGER_START, classes: ["MAGE"] },
		choices: [
			"[MAGE]",
			"Not our business",
			"[Seen through him]",
			"Let the acid",
		],
		expect: {
			flags: ["barnaby_suspected", "ledger_mercenary", "barnaby_dead"],
			step: { [Q.sump]: "quest-step-sump_investigate" },
		},
	},
	{
		name: "ledger: sell Barnaby the book",
		quest: Q.ledger,
		setup: LEDGER_START,
		choices: ["Consider it done", "This isn't medicine", "Here's your book"],
		expect: {
			flags: ["barnaby_free", "mutagen_spreading"],
			runes: ["rune_acid"],
			step: { [Q.sump]: "quest-step-sump_investigate" },
		},
	},
	{
		name: "ledger: lose to Barnaby, accept, he escapes",
		quest: Q.ledger,
		setup: LEDGER_START,
		choices: [...FIGHT_BARNABY, "Report him"],
		battles: { "encounter-mutated_barnaby": ["lose"] },
		expect: {
			flags: ["barnaby_escaped", "mutagen_spreading"],
			noRunes: ["rune_acid"],
			step: { [Q.sump]: "quest-step-sump_investigate" },
		},
	},
	{
		name: "ledger: lose to Barnaby, Try again, win",
		quest: Q.ledger,
		setup: LEDGER_START,
		choices: [...FIGHT_BARNABY, "Drag him out"],
		battles: { "encounter-mutated_barnaby": ["lose", "win"] },
		defeat: ["Try again"],
		expect: { flags: ["barnaby_jailed"] },
	},

	// ------------------------------------------------ The Ironhold Sump
	{
		name: "sump: toad, Riverbend, all saved, stay",
		quest: Q.sump,
		setup: SUMP_START,
		choices: [
			...TOAD_TO_RIVERBEND,
			"Draw your weapons",
			"Accept the charm and stay",
		],
		battles: { "encounter-riverbend_village": [{ savedVillagers: 4 }] },
		expect: {
			flags: ["riverbend_all_saved", "black_fangs_fortified"],
			runes: ["rune_nature"],
			node: "ironhold_city",
		},
	},
	{
		name: "sump: Riverbend with some saved, then the fortified den, burn",
		quest: Q.sump,
		setup: SUMP_START,
		choices: [
			...TOAD_TO_RIVERBEND,
			"Draw your weapons",
			"Find the ones",
			"Hold on",
			"Burn every",
		],
		battles: { "encounter-riverbend_village": [{ savedVillagers: 2 }] },
		expect: {
			flags: ["black_fangs_fortified", "black_fangs_broken"],
			noFlags: ["riverbend_all_saved"],
			monsters: { "encounter-sump_watcher": { "Sump Slime": 2 } },
		},
	},
	{
		name: "sump: all saved, then the den, keep a vial",
		quest: Q.sump,
		setup: SUMP_START,
		choices: [
			...TOAD_TO_RIVERBEND,
			"Draw your weapons",
			"Accept the charm, then go",
			"Hold on",
			"Keep one vial",
		],
		battles: { "encounter-riverbend_village": [{ savedVillagers: 4 }] },
		expect: {
			flags: ["riverbend_all_saved", "kept_mutagen"],
			runes: ["rune_nature", "rune_blood"],
		},
	},
	{
		name: "sump: smugglers first, burn the cargo",
		quest: Q.sump,
		setup: SUMP_START,
		choices: [...TOAD_TO_DEN, "Hold on", "Burn every"],
		expect: {
			flags: ["riverbend_doomed", "black_fangs_broken"],
			monsters: { "encounter-sump_watcher": { "Sump Slime": 0 } },
		},
	},
	{
		name: "sump: smugglers, return the cargo to pay Vane's debt",
		quest: Q.sump,
		setup: { ...SUMP_START, flags: ["vane_debt"] },
		choices: [...TOAD_TO_DEN, "Hold on", "Return them to Vane"],
		expect: {
			flags: ["vane_debt_paid", "black_fangs_broken"],
			noFlags: ["vane_debt"],
			runes: ["rune_tides"],
		},
	},
	{
		name: "sump: lose to the toad, chase it to Riverbend",
		quest: Q.sump,
		setup: SUMP_START,
		choices: [
			"Brace yourselves",
			"Chase it",
			"Rush into the village",
			"Draw your weapons",
			"Stay and help",
		],
		battles: { "encounter-giant_toad": ["lose"] },
		expect: {
			flags: ["toad_escaped"],
			noFlags: ["riverbend_doomed"],
			monsters: { "encounter-riverbend_village": { "Giant Toad": 1 } },
		},
	},
	{
		name: "sump: lose to the toad, warn the guard, smugglers",
		quest: Q.sump,
		setup: SUMP_START,
		choices: [
			"Brace yourselves",
			"Warn the city guard",
			"Hold on",
			"Burn every",
		],
		battles: { "encounter-giant_toad": ["lose"] },
		expect: {
			flags: ["toad_escaped", "riverbend_doomed", "black_fangs_broken"],
		},
	},
	{
		name: "sump: lose Riverbend, hunt the Black Fangs",
		quest: Q.sump,
		setup: SUMP_START,
		choices: [
			...TOAD_TO_RIVERBEND,
			"Draw your weapons",
			"Someone will pay",
			"Hold on",
			"Burn every",
		],
		battles: { "encounter-riverbend_village": ["lose"] },
		expect: { flags: ["riverbend_fallen", "black_fangs_broken"] },
	},
	{
		name: "sump: lose Riverbend, walk away",
		quest: Q.sump,
		setup: SUMP_START,
		choices: [...TOAD_TO_RIVERBEND, "Draw your weapons", "Walk away"],
		battles: { "encounter-riverbend_village": ["lose"] },
		expect: {
			flags: ["riverbend_fallen"],
			noFlags: ["black_fangs_broken"],
			node: "ironhold_city",
		},
	},
	{
		name: "sump: lose at the den, come back later, win",
		quest: Q.sump,
		setup: SUMP_START,
		choices: [
			...TOAD_TO_DEN,
			"Hold on",
			"They'll be back",
			"Hold on",
			"Burn every",
		],
		battles: { "encounter-sump_watcher": ["lose", "win"] },
		expect: { flags: ["black_fangs_broken"] },
	},
	{
		name: "sump: lose at the den, let them go",
		quest: Q.sump,
		setup: SUMP_START,
		choices: [...TOAD_TO_DEN, "Hold on", "Let them go"],
		battles: { "encounter-sump_watcher": ["lose"] },
		expect: { flags: ["black_fangs_escaped"], noFlags: ["black_fangs_broken"] },
	},
	{
		name: "sump: the open cellar tunnel skips the toad",
		quest: Q.sump,
		setup: { ...SUMP_START, flags: ["cellar_tunnel_open"] },
		choices: [
			"Rusty Boar's old tunnel",
			"Quietly",
			"Let Riverbend fend",
			"Begin: The Smuggler",
			"Hold on",
			"Burn every",
		],
		expect: { flags: ["sump_snuck_past"], notFought: ["encounter-giant_toad"] },
	},
	{
		name: "sump: jailed Barnaby heals the party",
		quest: Q.sump,
		setup: { ...SUMP_START, flags: ["barnaby_jailed"], hp: 2 },
		choices: ["Barnaby's cell", ...TOAD_TO_DEN, "Hold on", "Burn every"],
		expect: { flags: ["barnaby_visited"], hpAtFirstBattle: 10 },
	},
	{
		name: "sump: spreading mutagen and the escaped Rat King join the toad",
		quest: Q.sump,
		setup: { ...SUMP_START, flags: ["mutagen_spreading", "rat_king_escaped"] },
		choices: [...TOAD_TO_DEN, "Hold on", "Burn every"],
		expect: {
			monsters: {
				"encounter-giant_toad": {
					"Rat King": 1,
					"Sump Slime": 2,
					"Giant Toad": 1,
				},
			},
		},
	},
	{
		name: "sump: [Rogue] scouts Riverbend",
		quest: Q.sump,
		setup: { ...SUMP_START, classes: ["ROGUE"] },
		choices: [...TOAD_TO_RIVERBEND, "[Rogue]", "Stay and help"],
		expect: { flags: ["riverbend_scouted"] },
	},
	{
		name: "sump: [Mage] burns the sludge while mutagen spreads",
		quest: Q.sump,
		setup: { ...SUMP_START, classes: ["MAGE"], flags: ["mutagen_spreading"] },
		choices: [...TOAD_TO_RIVERBEND, "[Mage]", "Stay and help"],
		expect: { flags: ["riverbend_sludge_burned"] },
	},
	{
		name: "sump: no Mage while mutagen spreads",
		quest: Q.sump,
		setup: { ...SUMP_START, flags: ["mutagen_spreading"] },
		choices: [...TOAD_TO_RIVERBEND, "Draw your weapons", "Stay and help"],
		expect: { noFlags: ["riverbend_sludge_burned"] },
	},
	{
		name: "sump: [Cleric] heals before Riverbend",
		quest: Q.sump,
		setup: { ...SUMP_START, classes: ["CLERIC"], hp: 2 },
		choices: [...TOAD_TO_RIVERBEND, "[Cleric]", "Stay and help"],
		expect: {},
	},

	// ------------------------------------------------ The Archmage's Price (Necromancer)
	{
		name: "necro: straight through, hand over the tome",
		quest: Q.necro,
		setup: NECRO_START,
		choices: ["Descend", "Hand over"],
		expect: { flags: ["archmage_ally"], runes: ["rune_arcane"] },
	},
	{
		name: "necro: rest first, keep the tome",
		quest: Q.necro,
		setup: NECRO_START,
		choices: ["We need to rest", "Descend", "The tome stays"],
		expect: {
			flags: ["kept_necronomicon", "archmage_hostile"],
			runes: ["rune_blood"],
		},
	},
	{
		name: "necro: [Cleric] burns the tome",
		quest: Q.necro,
		setup: { ...NECRO_START, classes: ["CLERIC"] },
		choices: ["Descend", "[Cleric]"],
		expect: { flags: ["tome_burned"], noRunes: ["rune_arcane", "rune_blood"] },
	},
	{
		name: "necro: lose, regroup, win",
		quest: Q.necro,
		setup: NECRO_START,
		choices: ["Descend", "Regroup", "Descend", "Hand over"],
		battles: { "encounter-necromancer_boss": ["lose", "win"] },
		expect: { flags: ["archmage_ally"] },
	},
	{
		name: "necro: lose, seal him in, sent back down, win",
		quest: Q.necro,
		setup: NECRO_START,
		choices: [
			"Descend",
			"Drop the slab",
			"Then we'll go back",
			"Descend",
			"Hand over",
		],
		battles: { "encounter-necromancer_boss": ["lose", "win"] },
		expect: { flags: ["archmage_ally"], noFlags: ["necromancer_free"] },
	},
	{
		name: "necro: lose, seal him in, walk away",
		quest: Q.necro,
		setup: NECRO_START,
		choices: ["Descend", "Drop the slab", "We're done with your errands"],
		battles: { "encounter-necromancer_boss": ["lose"] },
		expect: { flags: ["necromancer_free", "archmage_hostile"] },
	},

	// ------------------------------------------------ The Sealed Passage (Dwarves)
	{
		name: "dwarves: fight now, salvage the core",
		quest: Q.dwarves,
		setup: DWARF_START,
		choices: ["Hold your ground", "Pry out the core"],
		expect: { runes: ["rune_mountain"], node: "dwarven_passage" },
	},
	{
		name: "dwarves: rest, come back, rebuild the golem",
		quest: Q.dwarves,
		setup: DWARF_START,
		choices: ["Fall back and rest", "Hold your ground", "Rebuild it"],
		expect: {
			flags: ["dwarves_allied"],
			runes: ["rune_iron"],
			node: "dwarven_passage",
		},
	},
	{
		name: "dwarves: lose, try later, win",
		quest: Q.dwarves,
		setup: DWARF_START,
		choices: [
			"Hold your ground",
			"We'll be back",
			"Hold your ground",
			"Pry out the core",
		],
		battles: { "encounter-golem_boss": ["lose", "win"] },
		expect: { runes: ["rune_mountain"] },
	},
	{
		name: "dwarves: lose, collapse the passage",
		quest: Q.dwarves,
		setup: DWARF_START,
		choices: ["Hold your ground", "can't be done"],
		battles: { "encounter-golem_boss": ["lose"] },
		expect: {
			flags: ["passage_collapsed"],
			noRunes: ["rune_mountain", "rune_iron"],
		},
	},

	// ------------------------------------------------ The Shadow's Debt
	{
		name: "vane: take the job, hand over the sigil",
		quest: Q.vane,
		setup: VANE_START,
		choices: [...VANE_JOB, ...VANE_REWARD],
		expect: { flags: ["vane_contract_signed"], runes: ["rune_tides"] },
	},
	{
		name: "vane: [Mage] insight, warning, haggle",
		quest: Q.vane,
		setup: { ...VANE_START, classes: ["MAGE"] },
		choices: [
			"(Arcane Insight)",
			"The Iron Isles",
			"Fine. I'll take",
			"A wolf made of thorns",
			"Draw your steel",
			"Clean the sigil",
			"I want gold",
			"things to finish",
		],
		expect: { runes: ["rune_tides"] },
	},
	{
		name: "vane: lose to the wolf, hunt again, win",
		quest: Q.vane,
		setup: VANE_START,
		choices: [
			...VANE_JOB,
			"Bind your wounds",
			"Draw your steel",
			...VANE_REWARD,
		],
		battles: { "encounter-briar_wolf_boss": ["lose", "win"] },
		expect: { runes: ["rune_tides"] },
	},
	{
		name: "vane: lose, confess, second chance, win",
		quest: Q.vane,
		setup: VANE_START,
		choices: [
			...VANE_JOB,
			"tell him the truth",
			"another chance",
			"Draw your steel",
			...VANE_REWARD,
		],
		battles: { "encounter-briar_wolf_boss": ["lose", "win"] },
		expect: { flags: ["briar_wolf_escaped"], runes: ["rune_tides"] },
	},
	{
		name: "vane: lose, confess, walk away in debt",
		quest: Q.vane,
		setup: VANE_START,
		choices: [...VANE_JOB, "tell him the truth", "done with this job"],
		battles: { "encounter-briar_wolf_boss": ["lose"] },
		expect: { flags: ["vane_debt"], noRunes: ["rune_tides"] },
	},

	// ------------------------------------------------ The Verdant Reclamation
	{
		name: "verdant: full defend path, win everything",
		quest: Q.verdant,
		setup: VERDANT_START,
		choices: [
			"Sounds dangerous",
			"head to the camp",
			"Return to the city",
			"[Defend the City]",
			"Assess",
			"Assess",
			"Assess",
			...DEFEND_SIEGE,
		],
		expect: {
			flags: ["aligned_with_ironhold", "ironhold_saved"],
			runes: ["rune_iron"],
		},
	},
	{
		name: "verdant: join the Host, assault, win",
		quest: Q.verdant,
		setup: VERDANT_START,
		choices: [
			"head to the camp",
			"Return to the city",
			"[Join the Host]",
			...ASSAULT_SIEGE,
		],
		expect: {
			flags: ["aligned_with_forest", "ironhold_fallen"],
			runes: ["rune_nature"],
		},
	},
	{
		name: "verdant: lose at the bridge, stay loyal",
		quest: Q.verdant,
		setup: { active: { [Q.verdant]: "quest-step-the_ultimatum" } },
		choices: [
			"[Defend the City]",
			"still our home",
			"Assess",
			"Assess",
			"Assess",
			...DEFEND_SIEGE,
		],
		battles: { "encounter-elven_commander": ["lose"] },
		expect: {
			flags: ["aligned_with_ironhold", "ironhold_saved"],
			noFlags: ["aligned_with_forest"],
		},
	},
	{
		name: "verdant: lose at the bridge, turn to the forest",
		quest: Q.verdant,
		setup: { active: { [Q.verdant]: "quest-step-the_ultimatum" } },
		choices: ["[Defend the City]", "Show us", ...ASSAULT_SIEGE],
		battles: { "encounter-elven_commander": ["lose"] },
		expect: {
			flags: ["aligned_with_forest", "turned_at_the_bridge", "ironhold_fallen"],
			noFlags: ["aligned_with_ironhold"],
		},
	},
	{
		name: "verdant: spare the Rusty Boar, lose to the King, banished",
		quest: Q.verdant,
		setup: {
			active: { [Q.verdant]: "quest-step-assault_ironhold" },
			flags: ["aligned_with_forest", "cellar_sealed"],
		},
		choices: [
			"Charge!",
			"Go deeper",
			"Get your people out",
			"Your reign ends",
			"Retreat with",
		],
		battles: { "encounter-ironhold_king_boss": ["lose"] },
		expect: {
			flags: ["spared_rusty_boar", "banished_from_ironhold", "ironhold_saved"],
			node: "cromee_town",
			notFought: ["encounter-assault_tavern_ambush"],
		},
	},
	{
		name: "verdant: fight the Rusty Boar anyway",
		quest: Q.verdant,
		setup: {
			active: { [Q.verdant]: "quest-step-assault_ironhold" },
			flags: ["aligned_with_forest", "cellar_sealed"],
		},
		choices: [
			"Charge!",
			"Go deeper",
			"Nothing personal",
			"Leave the tavern",
			"Your reign ends",
			"Take the Nature rune",
		],
		expect: { flags: ["ironhold_fallen"], noFlags: ["spared_rusty_boar"] },
	},
	{
		name: "verdant: friend at the tavern, dwarves, lose to the Arch-Druid",
		quest: Q.verdant,
		setup: {
			active: { [Q.verdant]: "quest-step-defend_ironhold" },
			flags: ["aligned_with_ironhold", "cellar_sealed", "dwarves_allied"],
			hp: 3,
		},
		choices: [
			"Push them back",
			"Go deeper",
			"Hold the bar together",
			"Leave the tavern",
			"Send word to the dwarves",
			"Defend the king",
			"Lead the survivors",
		],
		battles: { "encounter-ironhold_arch_druid_boss": ["lose"] },
		expect: {
			flags: ["dwarves_called", "ironhold_fallen", "led_the_refugees"],
			node: "cromee_town",
		},
	},
];
