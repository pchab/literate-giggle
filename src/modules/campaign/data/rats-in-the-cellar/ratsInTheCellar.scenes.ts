import type { Scene } from "../../domain/scenes.type";
import { THE_ALCHEMISTS_LEDGER } from "../alchemists-ledger/alchemistsLedger.definitions";
import { RAT_IN_THE_CELLAR } from "./ratsInTheCellar.definitions";

export const RATS_IN_THE_CELLAR_SCENES: Record<Scene["id"], Scene> = {
	[RAT_IN_THE_CELLAR.scenes.job_offer]: {
		id: RAT_IN_THE_CELLAR.scenes.job_offer,
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/rusty_boar_tavern.webp",
				speaker: "Rusty Boar bartender",
				text: "Filthy rats! They came out of nowhere... Can you help me out ? I'll give you a free round of ale.",
				choices: [
					{
						label: "Fine... I'll do it.",

						actions: [
							{
								type: "START_BATTLE",
								encounterId: RAT_IN_THE_CELLAR.encounters.rat_mob,
								background: "rusty_boar_cellar",
							},
						],
					},
				],
			},
		},
	},
	[RAT_IN_THE_CELLAR.scenes.investigate_cellar]: {
		id: RAT_IN_THE_CELLAR.scenes.investigate_cellar,
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/rusty_boar_cellar.webp",
				speaker: "...",
				text: "They seem to be coming from that trap door... You hear chittering sounds... They're coming!",
				choices: [
					{
						label: "F***.",

						actions: [
							{
								type: "START_BATTLE",
								encounterId: RAT_IN_THE_CELLAR.encounters.rat_boss,
								background: "rusty_boar_cellar",
							},
						],
					},
				],
			},
		},
	},

	[RAT_IN_THE_CELLAR.scenes.report_victory]: {
		id: RAT_IN_THE_CELLAR.scenes.report_victory,
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/rusty_boar_tavern.webp",
				speaker: "Rusty Boar bartender",
				text: "I didn't know rats could get this big. Good job down there. Here's your ale, on the house.",
				onNext: [
					{ type: "COMPLETE_QUEST", questId: RAT_IN_THE_CELLAR.id },
					{
						type: "REWARD_EVO_RUNE",
						evoRune: "rune_pestilence",
					},
					{
						type: "ADVANCE_QUEST",
						questId: THE_ALCHEMISTS_LEDGER.id,
						newStepId: THE_ALCHEMISTS_LEDGER.steps.meet_barnaby,
					},
					{ type: "END_SCENE" },
				],
			},
		},
	},
};
