import type { Card } from "@/modules/cards/domain/cards.type";
import { cardId } from "@/modules/cards/helpers/cards.helper";
import { set as idbSet, STORES } from "@/modules/shared/store/lib/indexed-db";
import { create } from "zustand";

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
	resetDraft: () => Card["id"];
	saveToDatabase: () => Promise<void>;
}

const INITIAL_DRAFT: Omit<Card, "id" | "image"> = {
	name: "New Card",
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

const createNewCard = (): Card => {
	const newId = cardId(crypto.randomUUID());
	return {
		...INITIAL_DRAFT,
		id: newId as Card["id"],
		image: newId,
	};
};

export const useCardEditorStore = create<CardEditorState & CardEditorActions>(
	(set, get) => ({
		draftCard: createNewCard(),
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
		resetDraft: () => {
			const draftCard = createNewCard();
			set({ draftCard });
			return draftCard.id;
		},
		saveToDatabase: async () => {
			const { draftCard } = get();
			await idbSet(STORES.DATA, `card_${draftCard.id}`, draftCard);
		},
	}),
);
