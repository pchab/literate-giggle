"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { BattleGrid } from "@/modules/battle/components/BattleGrid";
import { useBattleStore } from "@/modules/battle/store/battle.store";
import { CardPropertyForm } from "@/modules/card-editor/components/CardPropertyForm";
import { useCardEditorStore } from "@/modules/card-editor/store/cardEditor.store";
import { MotionCamera } from "@/modules/shared/components/MotionCamera";
import { getBackgroundImage } from "@/modules/shared/helpers/backgroundImage.helpers";
import { HeroCard } from "@/modules/units/components/HeroCard";
import { isHero, monsterId } from "@/modules/units/helpers/units.helpers";

export default function CardEditorPage() {
	const { testMode, draftCard } = useCardEditorStore();
	const {
		initCardEditorTestBattle,
		calculateAIIntents,
		enemyAction,
		battleStatus,
		units,
		usedCardsThisTurn,
		activeHeroCard,
	} = useBattleStore(
		useShallow((state) => ({
			initCardEditorTestBattle: state.initCardEditorTestBattle,
			calculateAIIntents: state.calculateAIIntents,
			enemyAction: state.enemyAction,
			battleStatus: state.battleStatus,
			units: state.units,
			usedCardsThisTurn: state.usedCardsThisTurn,
			activeHeroCard: state.activeHeroCard,
		})),
	);

	// --- DEBOUNCED INITIALIZATION & CLEANUP ---
	useEffect(() => {
		const timer = setTimeout(() => {
			initCardEditorTestBattle(draftCard, testMode);
			if (testMode === "AI") {
				calculateAIIntents({
					[monsterId("dummy_target")]: {
						cardId: draftCard.id,
						unitId: monsterId("dummy_target"),
					},
				});
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [draftCard, testMode, calculateAIIntents, initCardEditorTestBattle]);

	useEffect(() => {
		return () => {
			useBattleStore.setState({
				battleStatus: "VICTORY",
				units: [],
				encounterId: null,
			});
		};
	}, []);

	// --- MICRO GAME-LOOP FOR SANDBOX ---
	const heroes = units.filter(isHero);
	const aliveHeroesCount = heroes.filter((h) => h.currentHp > 0).length;
	const isEnemyTurn =
		battleStatus === "ONGOING" &&
		!activeHeroCard &&
		aliveHeroesCount > 0 &&
		Object.keys(usedCardsThisTurn).length === aliveHeroesCount;

	useEffect(() => {
		if (isEnemyTurn) {
			const timeoutId = setTimeout(() => enemyAction(), 200);
			return () => clearTimeout(timeoutId);
		}
	}, [isEnemyTurn, enemyAction]);

	// Find our mock hero so we can render their UI
	const testHero = heroes[0];
	const backgroundImage = getBackgroundImage(
		"/battlegrounds/grass_3_2.webp",
		1200,
		800,
	);

	return (
		<div className="flex h-screen w-full bg-zinc-950 overflow-hidden">
			{/* LEFT PANE */}
			<div className="w-125 h-full z-10 shrink-0">
				<CardPropertyForm />
			</div>
			<div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-y-auto">
				<MotionCamera background={backgroundImage}>
					<BattleGrid />
				</MotionCamera>

				{/* BOTTOM UI: The Hero Card */}
				{testHero && (
					<div className="absolute bottom-0 flex justify-center w-full mt-4">
						<HeroCard {...testHero} />
					</div>
				)}
			</div>

			<div className="absolute top-4 right-4 px-3 py-1 bg-blue-600/80 text-white text-xs font-bold uppercase tracking-wider rounded backdrop-blur-sm z-50 pointer-events-none">
				Sandbox Mode
			</div>
		</div>
	);
}
