import type { Scene, SceneAction } from "@/modules/campaign/domain/scenes.type";
import { STORY_FLAGS } from "../../helpers/storyFlags";
import { SEWER_CONTAMINATION } from "./sewerContamination.definitions";

const F = STORY_FLAGS;

const fightToad: SceneAction = {
	type: "START_BATTLE",
	encounterId: SEWER_CONTAMINATION.encounters.giant_toad,
	background: "sewers",
};
const fightRiverbend: SceneAction = {
	type: "START_BATTLE",
	encounterId: SEWER_CONTAMINATION.encounters.riverbend_village,
	background: "grass_river_3_2",
};
const fightWatcher: SceneAction = {
	type: "START_BATTLE",
	encounterId: SEWER_CONTAMINATION.encounters.sump_watcher,
	background: "sewers_1",
};
const toStep = (
	stepKey: keyof typeof SEWER_CONTAMINATION.steps,
): SceneAction => ({
	type: "ADVANCE_QUEST",
	questId: SEWER_CONTAMINATION.id,
	newStepId: SEWER_CONTAMINATION.steps[stepKey],
});
const finishQuest: SceneAction = {
	type: "COMPLETE_QUEST",
	questId: SEWER_CONTAMINATION.id,
};

/** Choices shared by the two intro variants. */
const sumpIntroChoices = [
	{ label: "Brace yourselves!", actions: [fightToad] },
	{
		label: "Take the Rusty Boar's old tunnel and come up behind the nest.",
		reqFlags: [F.cellarTunnelOpen],
		actions: [
			{ type: "SET_FLAG", flagId: "sump_snuck_past" },
			{ type: "START_SCENE", sceneId: SEWER_CONTAMINATION.scenes.victory },
		] as SceneAction[],
	},
	{
		label: "Visit Barnaby's cell first. He made this mess.",
		reqFlags: [F.barnabyJailed],
		hideIfFlags: ["barnaby_visited"],
		actions: [{ type: "CHANGE_STEP", stepId: "barnaby-cell" }] as SceneAction[],
	},
];

export const sewerContaminationScenes: Record<string, Scene> = {
	// ==========================================
	// SUMP INTRO — reacts to the Rats and Alchemist choices
	// ==========================================
	[SEWER_CONTAMINATION.scenes.intro]: {
		id: SEWER_CONTAMINATION.scenes.intro,
		initialStepId: "step-1",
		steps: {
			"step-1": {
				text: "The stench of the Ironhold sewers is worse than usual. Glowing green sludge coats the stonework. Remembering the mutated rat from the tavern, you draw your weapons. Suddenly, the water erupts.",
				backgroundImage: "/scenes/sewers.webp",
				onEnter: [
					{
						type: "IF_FLAGS",
						all: [F.mutagenSpreading],
						actions: [{ type: "CHANGE_STEP", stepId: "step-1-spreading" }],
					},
				],
				choices: sumpIntroChoices,
			},
			"step-1-spreading": {
				text: "The sewers are drowning in fresh mutagen: Barnaby's new batches, still warm. Slimes bubble out of the walls, and something enormous stirs beneath the green water.",
				backgroundImage: "/scenes/sewers.webp",
				choices: sumpIntroChoices,
			},
			"barnaby-cell": {
				speaker: "Barnaby (in chains)",
				text: "Come to gloat? ...Fine. The toad gorged itself on my mutagen. It swallows anything that moves, but hurt it badly enough and it will spit its meal back out. Here, drink this. Real medicine. I do know how to make it.",
				backgroundImage: "/scenes/sewers.webp",
				onNext: [
					{ type: "SET_FLAG", flagId: "barnaby_visited" },
					{ type: "HEAL_PARTY", amount: 99 },
					{ type: "CHANGE_STEP", stepId: "step-1" },
				],
			},
		},
	},

	// ==========================================
	// TOAD DEFEAT — it escapes downstream
	// ==========================================
	[SEWER_CONTAMINATION.scenes.toad_lost]: {
		id: SEWER_CONTAMINATION.scenes.toad_lost,
		initialStepId: "flooded",
		steps: {
			flooded: {
				text: "You drag yourselves out of the filth. The Giant Toad is gone: a trail of glowing slime leads into the main aqueduct, straight downstream toward Riverbend.",
				backgroundImage: "/scenes/sewers.webp",
				choices: [
					{
						label: "Chase it to Riverbend before it gets there!",
						actions: [
							{ type: "SET_FLAG", flagId: F.toadEscaped },
							toStep("travel_to_village"),
							{ type: "END_SCENE" },
						],
					},
					{
						label:
							"Warn the city guard and follow the smugglers' trail instead.",
						actions: [
							{ type: "SET_FLAG", flagId: F.toadEscaped },
							{ type: "SET_FLAG", flagId: F.riverbendDoomed },
							toStep("find_cove"),
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},

	// ==========================================
	// THE STASH — the big branch: smugglers or Riverbend
	// ==========================================
	[SEWER_CONTAMINATION.scenes.victory]: {
		id: SEWER_CONTAMINATION.scenes.victory,
		initialStepId: "step-1",
		steps: {
			"step-1": {
				text: "The Giant Toad collapses, its toxic pustules hissing as they burst. Behind its nest, you find the smuggler's stash: dozens of shattered crates leaking raw mutagen directly into the main aqueduct.",
				backgroundImage: "/scenes/sewers_cleared.webp",
				onEnter: [
					{
						type: "IF_FLAGS",
						all: ["sump_snuck_past"],
						actions: [{ type: "CHANGE_STEP", stepId: "step-1-sneak" }],
					},
				],
				choices: [
					{
						label: "Inspect the damage.",
						actions: [{ type: "CHANGE_STEP", stepId: "step-2" }],
					},
				],
			},
			"step-1-sneak": {
				text: "The old tunnel comes out right behind the nest. The Giant Toad snores in the green water, belly swollen. You creep past it to the smugglers' stash: dozens of shattered crates leaking raw mutagen into the main aqueduct.",
				backgroundImage: "/scenes/sewers_cleared.webp",
				choices: [
					{
						label: "Inspect the damage. Quietly.",
						actions: [{ type: "CHANGE_STEP", stepId: "step-2" }],
					},
				],
			},
			"step-2": {
				text: "The water flows straight to Riverbend Village downstream. They will be drinking this by nightfall. However, a shipping manifest left behind reveals the surviving smugglers are delivering the rest of the intact crates to the Black Fang crime syndicate right now.",
				backgroundImage: "/scenes/sewers_cleared.webp",
				choices: [
					{
						label:
							"We have to stop the Black Fangs. Let Riverbend fend for itself.",
						actions: [{ type: "CHANGE_STEP", stepId: "step-smugglers" }],
					},
					{
						label:
							"We can't let innocent villagers turn into monsters. Rush to Riverbend!",
						actions: [{ type: "CHANGE_STEP", stepId: "step-riverbend" }],
					},
				],
			},
			"step-smugglers": {
				text: "If the Black Fangs get their hands on that mutagen, they'll build an army of unstoppable thugs. You follow the barge channel deeper into the sump, toward the syndicate's loading dock.",
				backgroundImage: "/scenes/smugglers_tracks.webp",
				choices: [
					{
						label: "Begin: The Smuggler's Den",
						actions: [
							{ type: "SET_FLAG", flagId: F.riverbendDoomed },
							toStep("find_cove"),
							{ type: "END_SCENE" },
						],
					},
				],
			},
			"step-riverbend": {
				text: "The syndicate will have to wait. You sprint out of the sewers, hoping to reach the village before they draw water from the wells. The smugglers slip away into the shadows.",
				backgroundImage: "/scenes/road_to_riverbend.webp",
				choices: [
					{
						label: "Begin: Riverbend Quarantine",
						actions: [
							{ type: "SET_FLAG", flagId: "black_fangs_fortified" },
							toStep("travel_to_village"),
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},

	// ==========================================
	// RIVERBEND — class approaches change the fight
	// ==========================================
	[SEWER_CONTAMINATION.scenes.riverbend_arrival]: {
		id: SEWER_CONTAMINATION.scenes.riverbend_arrival,
		initialStepId: "arrival",
		steps: {
			arrival: {
				text: "You arrive at Riverbend just as the sun dips below the mountains. The river, usually crystal clear, is choked with a glowing, viscous sludge. The silence is broken by a chorus of panicked screams from the town square.",
				backgroundImage: "/scenes/riverbend_panic.webp",
				onEnter: [
					{
						type: "IF_FLAGS",
						all: [F.toadEscaped],
						actions: [{ type: "CHANGE_STEP", stepId: "arrival-toad" }],
					},
				],
				choices: [
					{
						label: "Rush into the village.",
						actions: [{ type: "CHANGE_STEP", stepId: "confrontation" }],
					},
				],
			},
			"arrival-toad": {
				text: "You're too late to beat it here. The Giant Toad squats in the middle of Riverbend's main street, gulping sludge from the river, while the villagers scream from the rooftops.",
				backgroundImage: "/scenes/riverbend_panic.webp",
				choices: [
					{
						label: "Rush into the village.",
						actions: [{ type: "CHANGE_STEP", stepId: "confrontation" }],
					},
				],
			},
			confrontation: {
				speaker: "Panicked Villager",
				text: "They drank from the well! They drank the water and their skin just... sloughed off! Please, the bridge is blocked and the sludge is rising. We need to reach the Ironhold barricades!",
				backgroundImage: "/scenes/riverbend_panic.webp",
				choices: [
					{
						label:
							"[Cleric] Get behind me! My faith will protect you. (Party fully healed)",
						reqClass: "CLERIC",
						actions: [{ type: "HEAL_PARTY", amount: 99 }, fightRiverbend],
					},
					{
						label:
							"[Rogue] I'll slip behind the dead and cut them down first. (No pursuers)",
						reqClass: "ROGUE",
						actions: [
							{ type: "SET_FLAG", flagId: "riverbend_scouted" },
							fightRiverbend,
						],
					},
					{
						label:
							"[Mage] I'll burn the sludge at the well before it spawns more. (Fewer undead)",
						reqClass: "MAGE",
						actions: [
							{ type: "SET_FLAG", flagId: "riverbend_sludge_burned" },
							fightRiverbend,
						],
					},
					{
						label: "Draw your weapons. Everyone, run for the barricades!",
						actions: [fightRiverbend],
					},
				],
			},
		},
	},

	[SEWER_CONTAMINATION.scenes.riverbend_victory]: {
		id: SEWER_CONTAMINATION.scenes.riverbend_victory,
		initialStepId: "some",
		steps: {
			some: {
				text: "The last of the villagers stumble behind the Ironhold barricade. Not everyone made it. Those who did stare back at the glowing river in silence, clutching what little they carried out.",
				backgroundImage: "/scenes/road_to_riverbend.webp",
				onEnter: [
					{
						type: "IF_FLAGS",
						all: [F.riverbendAllSaved],
						actions: [{ type: "CHANGE_STEP", stepId: "all" }],
					},
				],
				choices: [
					{
						label: "Find the ones who poisoned the river.",
						actions: [toStep("find_cove"), { type: "END_SCENE" }],
					},
					{
						label: "Stay and help them rebuild.",
						actions: [finishQuest, { type: "END_SCENE" }],
					},
				],
			},
			all: {
				speaker: "Riverbend Elder",
				text: "Every single one of us. I didn't think it possible. Take this: the river spirit's charm has watched over this village for a hundred years. It will watch over you now.",
				backgroundImage: "/scenes/road_to_riverbend.webp",
				choices: [
					{
						label: "Accept the charm, then go after the Black Fangs.",
						actions: [
							{ type: "REWARD_EVO_RUNE", evoRune: "rune_nature" },
							{ type: "HEAL_PARTY", amount: 99 },
							toStep("find_cove"),
							{ type: "END_SCENE" },
						],
					},
					{
						label: "Accept the charm and stay to help.",
						actions: [
							{ type: "REWARD_EVO_RUNE", evoRune: "rune_nature" },
							{ type: "HEAL_PARTY", amount: 99 },
							finishQuest,
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},

	[SEWER_CONTAMINATION.scenes.riverbend_lost]: {
		id: SEWER_CONTAMINATION.scenes.riverbend_lost,
		initialStepId: "fallen",
		steps: {
			fallen: {
				text: "The barricade slams shut with too few people behind it. Across the river, Riverbend's lanterns go out one by one, and something answers the bells with a wet, gurgling howl.",
				backgroundImage: "/scenes/riverbend_panic.webp",
				choices: [
					{
						label: "Someone will pay for this. Find the Black Fangs.",
						actions: [
							{ type: "SET_FLAG", flagId: F.riverbendFallen },
							toStep("find_cove"),
							{ type: "END_SCENE" },
						],
					},
					{
						label: "Walk away. There's nothing left to save.",
						actions: [
							{ type: "SET_FLAG", flagId: F.riverbendFallen },
							finishQuest,
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},

	// ==========================================
	// THE SMUGGLER'S DEN — the Sump Watcher
	// ==========================================
	[SEWER_CONTAMINATION.scenes.smugglers_den]: {
		id: SEWER_CONTAMINATION.scenes.smugglers_den,
		initialStepId: "dock",
		steps: {
			dock: {
				text: "Deep under Ironhold, the Black Fangs load crates onto a flat barge. Behind them, a mountain of slime rises from the sump: a Watcher, bloated on spilled mutagen. It won't let anyone near the cargo... and it won't last long either.",
				backgroundImage: "/scenes/sewers.webp",
				onEnter: [
					{
						type: "IF_FLAGS",
						all: ["black_fangs_fortified"],
						actions: [{ type: "CHANGE_STEP", stepId: "dock-fortified" }],
					},
				],
				choices: [
					{ label: "Hold on until it dissolves!", actions: [fightWatcher] },
					{
						label: "Not yet. (Come back later)",
						actions: [{ type: "END_SCENE" }],
					},
				],
			},
			"dock-fortified": {
				text: "You took too long. The Black Fangs have barricaded the dock and fed the sump so much mutagen that slimes crawl over everything. The Watcher looms behind them, bloated and furious.",
				backgroundImage: "/scenes/sewers.webp",
				choices: [
					{ label: "Hold on until it dissolves!", actions: [fightWatcher] },
					{
						label: "Not yet. (Come back later)",
						actions: [{ type: "END_SCENE" }],
					},
				],
			},
		},
	},

	[SEWER_CONTAMINATION.scenes.den_victory]: {
		id: SEWER_CONTAMINATION.scenes.den_victory,
		initialStepId: "cargo",
		steps: {
			cargo: {
				text: "The Watcher melts into a steaming puddle and the smugglers scatter. The barge is yours: a dozen sealed crates of mutagen, enough to turn a whole district into monsters.",
				backgroundImage: "/scenes/sewers_cleared.webp",
				onEnter: [
					{
						type: "IF_FLAGS",
						all: [F.riverbendDoomed],
						none: [F.riverbendAllSaved],
						actions: [{ type: "CHANGE_STEP", stepId: "cargo-doomed" }],
					},
				],
				choices: [
					{
						label: "Burn every last crate.",
						actions: [{ type: "CHANGE_STEP", stepId: "burn" }],
					},
					{
						label:
							"These crates carry the Hollow Keel's mark. Return them to Vane.",
						reqFlags: ["vane_debt"],
						actions: [{ type: "CHANGE_STEP", stepId: "vane" }],
					},
					{
						label: "Keep one vial. Power is power.",
						actions: [{ type: "CHANGE_STEP", stepId: "keep" }],
					},
				],
			},
			"cargo-doomed": {
				text: "The Watcher melts into a steaming puddle and the smugglers scatter. Through a grate high above, you can smell smoke drifting from downstream. Riverbend paid for this victory. The barge holds a dozen sealed crates of mutagen.",
				backgroundImage: "/scenes/sewers_cleared.webp",
				choices: [
					{
						label: "Burn every last crate.",
						actions: [{ type: "CHANGE_STEP", stepId: "burn" }],
					},
					{
						label:
							"These crates carry the Hollow Keel's mark. Return them to Vane.",
						reqFlags: ["vane_debt"],
						actions: [{ type: "CHANGE_STEP", stepId: "vane" }],
					},
					{
						label: "Keep one vial. Power is power.",
						actions: [{ type: "CHANGE_STEP", stepId: "keep" }],
					},
				],
			},
			burn: {
				text: "The mutagen goes up in a sickly green blaze. Whatever the Black Fangs were planning, they'll have to start from nothing.",
				backgroundImage: "/scenes/sewers_cleared.webp",
				onNext: [
					{ type: "SET_FLAG", flagId: F.blackFangsBroken },
					{ type: "HEAL_PARTY", amount: 99 },
					finishQuest,
					{ type: "END_SCENE" },
				],
			},
			vane: {
				speaker: "Captain Vane",
				text: "Well, well. My stolen cargo, delivered by the people who owe me. Consider your debt paid, friends. And the Black Fangs will think twice before they rob the Hollow Keel again.",
				backgroundImage: "/scenes/port_city_ship.webp",
				onNext: [
					{ type: "CLEAR_FLAG", flagId: "vane_debt" },
					{ type: "SET_FLAG", flagId: "vane_debt_paid" },
					{ type: "SET_FLAG", flagId: F.blackFangsBroken },
					{ type: "REWARD_EVO_RUNE", evoRune: "rune_tides" },
					finishQuest,
					{ type: "END_SCENE" },
				],
			},
			keep: {
				text: "You pocket a single vial before torching the rest. It pulses against your hip like a second heartbeat, hungry and warm.",
				backgroundImage: "/scenes/sewers_cleared.webp",
				onNext: [
					{ type: "SET_FLAG", flagId: F.blackFangsBroken },
					{ type: "SET_FLAG", flagId: "kept_mutagen" },
					{ type: "REWARD_EVO_RUNE", evoRune: "rune_blood" },
					finishQuest,
					{ type: "END_SCENE" },
				],
			},
		},
	},

	[SEWER_CONTAMINATION.scenes.den_lost]: {
		id: SEWER_CONTAMINATION.scenes.den_lost,
		initialStepId: "washed",
		steps: {
			washed: {
				text: "The Watcher's flood sweeps you down the channel and spits you out into the river. By the time you crawl back, the barge is gone, and the Black Fangs with it.",
				backgroundImage: "/scenes/smugglers_tracks.webp",
				choices: [
					{
						label:
							"They'll be back for more. We'll be waiting. (Try again later)",
						actions: [{ type: "END_SCENE" }],
					},
					{
						label: "Let them go. This city isn't worth drowning for.",
						actions: [
							{ type: "SET_FLAG", flagId: F.blackFangsEscaped },
							finishQuest,
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},
};
