import { type Scene, sceneId } from "../domain/scenes.type";

export const SCENE_DB: Record<Scene["id"], Scene> = {
	// GENERIC scenes
	[sceneId("generic_tavern")]: {
		id: sceneId("generic_tavern"),
		initialStepId: "start",
		steps: {
			start: {
				backgroundImage: "/scenes/generic_tavern.jpg",
				text: "You enter the tavern, the smell of roasted meat and ale fills your nostrils. The barkeep greets you with a smile.",
				onNext: [{ type: "END_SCENE" }],
			},
		},
	},
	
	
};
