import type { Scene } from "@/modules/campaign/domain/scenes.type";
import {
	QUEST_3_IRONHOLD_SUMP,
	QUEST_4A_SMUGGLER_DEN,
	QUEST_4B_ZOMBIE_RIVERBEND,
} from "./sewerContamination.definitions";

export const ironholdSumpScenes: Record<string, Scene> = {
	// --- PRE-BATTLE SCENE ---
	[QUEST_3_IRONHOLD_SUMP.scenes.intro]: {
		id: QUEST_3_IRONHOLD_SUMP.scenes.intro,
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
								encounterId: QUEST_3_IRONHOLD_SUMP.encounters.giant_toad,
								background: "sewers",
							},
						],
					},
				],
			},
		},
	},

	// --- POST-BATTLE SCENE & CAMPAIGN BRANCH ---
	[QUEST_3_IRONHOLD_SUMP.scenes.victory]: {
		id: QUEST_3_IRONHOLD_SUMP.scenes.victory,
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
							{ type: "COMPLETE_QUEST", questId: QUEST_3_IRONHOLD_SUMP.id },
							{
								type: "ADVANCE_QUEST",
								questId: QUEST_4A_SMUGGLER_DEN.id,
								newStepId: QUEST_4A_SMUGGLER_DEN.steps.find_cove,
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
							{ type: "COMPLETE_QUEST", questId: QUEST_3_IRONHOLD_SUMP.id },
							{
								type: "ADVANCE_QUEST",
								questId: QUEST_4B_ZOMBIE_RIVERBEND.id,
								newStepId: QUEST_4B_ZOMBIE_RIVERBEND.steps.travel_to_village,
							},
							{ type: "END_SCENE" },
						],
					},
				],
			},
		},
	},
};
