import type { Card } from "@/modules/cards/domain/cards.type";
import { cardId } from "@/modules/cards/helpers/cards.helper";
import { create } from "zustand";
import { exportToJson } from "./commands/exportToJson.command";

export type CardEditorGet = () => EditorState;
export type CardEditorSet = (
	fn: (state: EditorState) => Partial<EditorState>,
) => void;

interface EditorState {
	// The current working draft of the card
	draftCard: Card;

	// Actions
	updateDraft: (changes: Partial<Card>) => void;
	resetDraft: () => void;
	exportToJSON: () => void;
}

const INITIAL_DRAFT: Card = {
	id: cardId("draft-card"),
	name: "New Card",
	image: "/cards/placeholder.webp",
	range: 1,
	playRequirement: "requires_enemy",
	effects: [
		{
			type: "damage",
			amount: 1,
			target: "anchor",
		},
	],
};

export const useCardEditorStore = create<EditorState>((set, get) => ({
	draftCard: { ...INITIAL_DRAFT },

	updateDraft: (changes) =>
		set((state) => ({
			draftCard: {
				...state.draftCard,
				...changes,
			},
		})),
	resetDraft: () => set({ draftCard: { ...INITIAL_DRAFT } }),
	exportToJSON: exportToJson(get),
}));
