import type { Scene, SceneAction } from "../../domain/scenes.type";
import { STORY_FLAGS } from "../../helpers/storyFlags";
import { THE_ALCHEMISTS_LEDGER } from "../alchemists-ledger/alchemistsLedger.definitions";
import { RAT_IN_THE_CELLAR } from "./ratsInTheCellar.definitions";

/** Every ending of the cellar job leads to Barnaby. */
const nextQuest: SceneAction[] = [
	{
		type: "ADVANCE_QUEST",
		questId: THE_ALCHEMISTS_LEDGER.id,
		newStepId: THE_ALCHEMISTS_LEDGER.steps.meet_barnaby,
	},
];

export const RATS_IN_THE_CELLAR_SCENES: Record<Scene["id"], Scene> = {
	[RAT_IN_THE_CELLAR.scenes.job_offer]: {
		id: RAT_IN_THE_CELLAR.scenes.job_offer,
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/rusty_boar_tavern.webp",
				speaker: "Rusty Boar bartender",
				text: "Filthy rats! They came out of nowhere... Can you help me out? I'll give you a free round of ale.",
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
				text: "I didn't know rats could get this big. Good job down there. Here's your ale, on the house. ...But what do we do about that trapdoor? I never knew it was there.",
				choices: [
					{
						label: "Nail it shut and pour mortar on top. No more rats.",
						actions: [
							{ type: "SET_FLAG", flagId: STORY_FLAGS.cellarSealed },
							{ type: "CHANGE_STEP", stepId: "sealed" },
						],
					},
					{
						label: "Leave it. A tunnel under Ironhold could come in handy.",
						actions: [
							{ type: "SET_FLAG", flagId: STORY_FLAGS.cellarTunnelOpen },
							{ type: "CHANGE_STEP", stepId: "open" },
						],
					},
				],
			},
			sealed: {
				backgroundImage: "/scenes/rusty_boar_tavern.webp",
				speaker: "Rusty Boar bartender",
				text: "Done and done. You've got a friend at the Rusty Boar for life. And there was this in the big one's nest... smells foul, but it hums. Take it.",
				onNext: [
					{ type: "COMPLETE_QUEST", questId: RAT_IN_THE_CELLAR.id },
					{ type: "REWARD_EVO_RUNE", evoRune: "rune_pestilence" },
					...nextQuest,
					{ type: "END_SCENE" },
				],
			},
			open: {
				backgroundImage: "/scenes/rusty_boar_tavern.webp",
				speaker: "Rusty Boar bartender",
				text: "Your funeral. I'll keep a barrel on it. Oh, and the big one was sitting on this. Smells foul, but it hums. Take it.",
				onNext: [
					{ type: "COMPLETE_QUEST", questId: RAT_IN_THE_CELLAR.id },
					{ type: "REWARD_EVO_RUNE", evoRune: "rune_pestilence" },
					...nextQuest,
					{ type: "END_SCENE" },
				],
			},
		},
	},

	// --- DEFEAT: the rat swarm ---
	[RAT_IN_THE_CELLAR.scenes.rats_overrun]: {
		id: RAT_IN_THE_CELLAR.scenes.rats_overrun,
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/rusty_boar_tavern.webp",
				speaker: "Rusty Boar bartender",
				text: "I dragged you up by the ankles. Gods, they're everywhere down there. Look, I can't pay you to die in my cellar. Go back down, or I'll just smoke the whole place out and drink to my losses.",
				choices: [
					{
						label: "One more try. Give us the ale after.",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: RAT_IN_THE_CELLAR.encounters.rat_mob,
								background: "rusty_boar_cellar",
							},
						],
					},
					{
						label: "Smoke them out. We'll help light the fires.",
						actions: [{ type: "CHANGE_STEP", stepId: "smoked" }],
					},
				],
			},
			smoked: {
				backgroundImage: "/scenes/rusty_boar_tavern.webp",
				speaker: "Rusty Boar bartender",
				text: "The rats are gone. So is half my stock, and my ale will taste of smoke till spring. Still... thanks for the help. A strange merchant was asking for sellswords this morning. Barnaby, in Connury. Try him.",
				onNext: [
					{ type: "SET_FLAG", flagId: STORY_FLAGS.rustyBoarSmoked },
					{ type: "COMPLETE_QUEST", questId: RAT_IN_THE_CELLAR.id },
					...nextQuest,
					{ type: "END_SCENE" },
				],
			},
		},
	},

	// --- DEFEAT: the Rat King ---
	[RAT_IN_THE_CELLAR.scenes.rat_king_escapes]: {
		id: RAT_IN_THE_CELLAR.scenes.rat_king_escapes,
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/rusty_boar_cellar.webp",
				text: "The Rat King squeals in triumph and drags its fat body back down the trapdoor. You hear it scrabbling away through the tunnel, deeper under the city.",
				choices: [
					{
						label: "After it! (Fight the Rat King again)",
						actions: [
							{
								type: "START_BATTLE",
								encounterId: RAT_IN_THE_CELLAR.encounters.rat_boss,
								background: "rusty_boar_cellar",
							},
						],
					},
					{
						label: "Collapse the tunnel behind it and be done with this.",
						actions: [{ type: "CHANGE_STEP", stepId: "collapsed" }],
					},
				],
			},
			collapsed: {
				backgroundImage: "/scenes/rusty_boar_tavern.webp",
				speaker: "Rusty Boar bartender",
				text: "The cellar's safe, I suppose. But that thing is still alive down there somewhere. Here's your ale. And if you need more work, a merchant called Barnaby is hiring in Connury.",
				onNext: [
					{ type: "SET_FLAG", flagId: STORY_FLAGS.ratKingEscaped },
					{ type: "SET_FLAG", flagId: STORY_FLAGS.cellarSealed },
					{ type: "COMPLETE_QUEST", questId: RAT_IN_THE_CELLAR.id },
					...nextQuest,
					{ type: "END_SCENE" },
				],
			},
		},
	},
};
