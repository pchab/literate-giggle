import type { Scene } from "@/modules/campaign/domain/scenes.type";
import { SEWER_CONTAMINATION } from "./sewerContamination.definitions";

export const sewerContaminationScenes: Record<string, Scene> = {
	// --- PRE-BATTLE SCENE ---
	[SEWER_CONTAMINATION.scenes.intro]: {
		id: SEWER_CONTAMINATION.scenes.intro,
		initialStepId: "step-1",
		steps: {
			"step-1": {
				text: "The stench of the Ironhold sewers is worse than usual. Glowing green sludge coats the stonework. Remembering the mutated rat from the tavern, you draw your weapons. Suddenly, the water erupts.",
				backgroundImage: "/scenes/sewers.webp",
				choices: [
					{
						label: "Brace yourselves!",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: SEWER_CONTAMINATION.encounters.giant_toad,
								background: "sewers",
							},
						],
					},
				],
			},
		},
	},

	// --- POST-BATTLE SCENE & CAMPAIGN BRANCH ---
	[SEWER_CONTAMINATION.scenes.victory]: {
		id: SEWER_CONTAMINATION.scenes.victory,
		initialStepId: "step-1",
		steps: {
			"step-1": {
				text: "The Giant Toad collapses, its toxic pustules hissing as they burst. Behind its nest, you find the smuggler's stash: dozens of shattered crates leaking raw mutagen directly into the main aqueduct.",
				backgroundImage: "/scenes/sewers_cleared.webp",
				choices: [
					{
						label: "Inspect the damage.",
						actions: [{ type: "CHANGE_STEP", stepId: "step-2" }],
					},
				],
			},
			"step-2": {
				text: "The water flows straight to Riverbend Village downstream. They will be drinking this by nightfall. However, a shipping manifest left behind reveals the surviving smugglers are delivering the *rest* of the intact crates to the Black Fang crime syndicate right now.",
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
				text: "If the Black Fangs get their hands on that mutagen, they'll build an army of unstoppable thugs. You leave the sewers and track the wagon tracks toward the coast.",
				backgroundImage: "/scenes/smugglers_tracks.webp",
				choices: [
					{
						label: "Begin Quest: The Smuggler's Den",
						actions: [
							{ type: "SET_FLAG", flagId: "riverbend_doomed" }, // Used to change the world map/town UI!
							{
								type: "ADVANCE_QUEST",
								questId: SEWER_CONTAMINATION.id,
								newStepId: SEWER_CONTAMINATION.steps.find_cove,
							},
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
						label: "Begin Quest: Riverbend Quarantine",
						actions: [
							{ type: "SET_FLAG", flagId: "black_fangs_fortified" }, // Used to make a future fight harder!
							{
								type: "ADVANCE_QUEST",
								questId: SEWER_CONTAMINATION.id,
								newStepId: SEWER_CONTAMINATION.steps.travel_to_village,
							},
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},
	[SEWER_CONTAMINATION.scenes.riverbend_arrival]: {
		id: SEWER_CONTAMINATION.scenes.riverbend_arrival,
		initialStepId: "arrival",
		steps: {
			arrival: {
				text: "You arrive at Riverbend just as the sun dips below the mountains. The river, usually crystal clear, is choked with a glowing, viscous sludge. The silence is broken by a chorus of panicked screams from the town square.",
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
							"[Cleric] Get behind me! My faith will protect you against the horde.",
						reqClass: "CLERIC",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: SEWER_CONTAMINATION.encounters.riverbend_village,
								background: "grass_river_3_2",
							},
						],
					},
					{
						label:
							"[Rogue] Stay quiet. I'll clear a path across the bridge. Run when I give the signal.",
						reqClass: "ROGUE",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: SEWER_CONTAMINATION.encounters.riverbend_village,
								background: "grass_river_3_2",
							},
						],
					},
					{
						label:
							"[Mage] The mutagen is highly unstable. Stay clear of the water, I'll handle the dead.",
						reqClass: "MAGE",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: SEWER_CONTAMINATION.encounters.riverbend_village,
								background: "grass_river_3_2",
							},
						],
					},
					{
						label: "Draw your weapons. Everyone, run for the barricades!",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: SEWER_CONTAMINATION.encounters.riverbend_village,
								background: "grass_river_3_2",
							},
						],
					},
				],
			},
		},
	},
};
