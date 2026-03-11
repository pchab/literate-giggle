import { sceneId } from "../domain/scenes.type";

export function generateTavernGenericScene(
	locationId: string,
	backgroundImage: string,
) {
	return {
		[sceneId(locationId)]: {
			id: sceneId(locationId),
			initialStepId: "intro",
			steps: {
				intro: {
					speaker: "Bartender",
					text: "What can I get you ?",
					backgroundImage,
					choices: [
						{
							label: "An ale.",
							actions: [{ type: "END_SCENE" }],
						},
						{
							label: "Nothing.",
							actions: [{ type: "END_SCENE" }],
						},
					],
				},
			},
		},
	};
}
