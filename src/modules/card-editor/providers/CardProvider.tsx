"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Card } from "@/modules/cards/domain/cards.type";
import LoadingAsset from "@/modules/shared/components/LoadingAsset";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import { useCardEditorStore } from "../store/cardEditor.store";

export function CardProvider({ children }: { children: React.ReactNode }) {
	const { cardId } = useParams() as { cardId: Card["id"] };
	const { loadDraft, updateDraft } = useCardEditorStore();
	const { getCard } = useRegistryStore();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		let isMounted = true;
		const existingCard = getCard(cardId);

		const bootEngine = async () => {
			if (existingCard) {
				loadDraft(existingCard);
			} else {
				updateDraft({
					id: cardId,
					image: `/cards/${cardId}`,
				});
			}

			if (isMounted) {
				setIsReady(true);
			}
		};

		bootEngine();

		return () => {
			isMounted = false;
		};
	}, [getCard, loadDraft, updateDraft, cardId]);

	if (!isReady) {
		return <LoadingAsset assetName="card" />;
	}

	return <>{children}</>;
}
