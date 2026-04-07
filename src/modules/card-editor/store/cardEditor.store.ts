import type { Card } from "@/modules/cards/domain/cards.type";
import { cardId } from "@/modules/cards/helpers/cards.helper";
import { create } from "zustand";
import { exportToJson } from "./commands/exportToJson.command";

export type EditorTestMode = "PLAYER" | "AI";

export type CardEditorGet = () => CardEditorState;
export type CardEditorSet = (
	fn: (state: CardEditorState) => Partial<CardEditorState>,
) => void;

interface CardEditorState {
	draftCard: Card;
	testMode: EditorTestMode;
}

interface CardEditorActions {
	setTestMode: (mode: EditorTestMode) => void;
	loadDraft: (card: Card) => void;
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

export const useCardEditorStore = create<CardEditorState & CardEditorActions>(
	(set, get) => ({
		draftCard: { ...INITIAL_DRAFT },
		testMode: "PLAYER",

		setTestMode: (mode) => set({ testMode: mode }),
		loadDraft: (card) => set({ draftCard: card }),
		updateDraft: (changes) =>
			set((state) => ({
				draftCard: {
					...state.draftCard,
					...changes,
				},
			})),
		resetDraft: () => set({ draftCard: { ...INITIAL_DRAFT } }),
		exportToJSON: exportToJson(get),
	}),
);
