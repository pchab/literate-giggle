import { type Scene, type SceneAction, sceneId } from "../domain/scenes.type";

/**
 * Tavern rumours: the world reacting to the player's choices.
 * The first matching rumour (top to bottom) is told; the last one is the fallback.
 */
const RUMOURS: { flags: string[]; text: string }[] = [
	{
		flags: ["ironhold_fallen"],
		text: "Ironhold's gone. Roots straight through the walls, they say, and the druids sleep in the king's bed now. Half my customers are refugees.",
	},
	{
		flags: ["banished_from_ironhold"],
		text: "The king's put a price on some sellswords who marched with the trees. Three of them, with a hobo look about them... Wasn't you, was it?",
	},
	{
		flags: ["riverbend_fallen"],
		text: "Riverbend's lanterns went dark a week ago. Folks hear bells across the river at night, and nobody rings them.",
	},
	{
		flags: ["riverbend_all_saved"],
		text: "The Riverbend folk won't shut up about the heroes who got every last soul out. Every one! Drinks for them are on the house, if you ever meet them.",
	},
	{
		flags: ["black_fangs_broken"],
		text: "The Black Fangs lost a whole barge under Ironhold. The syndicate's eating itself now. Good riddance.",
	},
	{
		flags: ["barnaby_free"],
		text: "There's a mad alchemist selling 'cures' in the slums. People who drink them don't come back looking quite the same.",
	},
	{
		flags: ["barnaby_escaped"],
		text: "Barnaby's face is nailed to every door in Connury. Nobody's claimed the reward. Some say he's living in the sewers now.",
	},
	{
		flags: ["barnaby_jailed"],
		text: "That alchemist, Barnaby? Rotting in the Ironhold dungeon, screaming about 'evolution' all night long.",
	},
	{
		flags: ["rat_king_escaped"],
		text: "Sewer workers swear there's a rat down there the size of a pony, wearing a crown of bones. I've stopped going to my own cellar.",
	},
	{
		flags: ["kept_necronomicon"],
		text: "The Archmage has barred his tower. Something about a stolen book. Mages are coming in here asking odd questions about you, friend.",
	},
	{
		flags: ["necromancer_free"],
		text: "Caravans won't cross the desert ruins anymore. Dead men walking the dunes at night, they say.",
	},
	{
		flags: ["passage_collapsed"],
		text: "The dwarves blew up the old mountain road. Whole thing's rubble now. No more dwarven ale for anyone.",
	},
	{
		flags: ["dwarves_allied"],
		text: "Dwarven caravans are back on the mountain road, and they keep asking after three strangers who fixed their golem. Friends of yours?",
	},
	{
		flags: ["vane_debt"],
		text: "A sailor from the Hollow Keel was in here asking about you. Said the captain 'never forgets a debt'. Mean anything to you?",
	},
	{
		flags: [],
		text: "Quiet times. Too quiet, if you ask me. Mark my words, something's brewing under this city.",
	},
];

/** Nested IF_FLAGS: jump to the first rumour whose flags are all set. */
const pickRumour = (index = 0): SceneAction[] => {
	const rumour = RUMOURS[index];
	if (!rumour || rumour.flags.length === 0) {
		return [{ type: "CHANGE_STEP", stepId: `rumour-${index}` }];
	}
	return [
		{
			type: "IF_FLAGS",
			all: rumour.flags,
			actions: [{ type: "CHANGE_STEP", stepId: `rumour-${index}` }],
			otherwise: pickRumour(index + 1),
		},
	];
};

export function generateTavernGenericScene(
	locationId: string,
	backgroundImage: string,
): Record<Scene["id"], Scene> {
	const rumourSteps = Object.fromEntries(
		RUMOURS.map((rumour, index) => [
			`rumour-${index}`,
			{
				speaker: "Bartender",
				text: rumour.text,
				backgroundImage,
				choices: [
					{
						label: "An ale, then. (Heal 2 HP)",
						actions: [
							{ type: "HEAL_PARTY", amount: 2 },
							{ type: "END_SCENE" },
						] as SceneAction[],
					},
					{
						label: "Thanks.",
						actions: [{ type: "END_SCENE" }] as SceneAction[],
					},
				],
			},
		]),
	);

	return {
		[sceneId(locationId)]: {
			id: sceneId(locationId),
			initialStepId: "intro",
			steps: {
				intro: {
					speaker: "Bartender",
					text: "What can I get you?",
					backgroundImage,
					choices: [
						{
							label: "An ale. (Heal 2 HP)",
							actions: [
								{ type: "HEAL_PARTY", amount: 2 },
								{ type: "END_SCENE" },
							],
						},
						{
							label: "Any news?",
							actions: [{ type: "CHANGE_STEP", stepId: "news" }],
						},
						{
							label: "Nothing.",
							actions: [{ type: "END_SCENE" }],
						},
					],
				},
				// Router: never shown for long, jumps to the right rumour on entry.
				news: {
					speaker: "Bartender",
					text: "News? Let me think...",
					backgroundImage,
					onEnter: pickRumour(),
					// Fallback if the router somehow doesn't jump.
					onNext: [
						{ type: "CHANGE_STEP", stepId: `rumour-${RUMOURS.length - 1}` },
					],
				},
				...rumourSteps,
			},
		},
	};
}
