"use client";

import { useCardEditorStore } from "@/modules/card-editor/store/cardEditor.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import { TabButton } from "@/modules/shared/components/TabButton";
import { useAssetStore } from "@/modules/shared/store/asset.store";
import { getAll, STORES } from "@/modules/shared/store/lib/indexed-db";
import { useUnitEditorStore } from "@/modules/unit-editor/store/unitEditor.store";
import {
	type UnitBlueprint,
	UnitStance,
} from "@/modules/units/domain/units.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type EditorTab = "units" | "cards";

function isCard(item: unknown): item is Card {
	return typeof item === "object" && item !== null && "effects" in item;
}

function isUnit(item: unknown): item is UnitBlueprint {
	return typeof item === "object" && item !== null && "intentPool" in item;
}

export default function EditorDashboard() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<EditorTab>("units");
	const [items, setItems] = useState<Card[] | UnitBlueprint[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// We bring in loadAsset so we can fetch thumbnails for the grid
	const { loadAsset, getSprite } = useAssetStore();

	useEffect(() => {
		const fetchDatabase = async () => {
			setIsLoading(true);
			try {
				const allData = await getAll(STORES.DATA);

				// Pre-load the Idle sprite for unit thumbnails
				if (activeTab === "units") {
					const filteredUnits = allData.filter(isUnit);
					setItems(filteredUnits);
					for (const unit of filteredUnits) {
						await loadAsset(`${unit.spriteBase}_${UnitStance.IDLE}`);
					}
				}
				if (activeTab === "cards") {
					const filteredCards = allData.filter(isCard);
					setItems(filteredCards);
				}
			} catch (error) {
				console.error("Failed to load campaign data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDatabase();
	}, [activeTab, loadAsset]);

	const handleCreateNew = () => {
		if (activeTab === "units") {
			useUnitEditorStore.getState().resetDraft();
			router.push("/editor/units");
		} else {
			useCardEditorStore.getState().resetDraft();
			router.push("/editor/cards");
		}
	};

	const handleEditItem = (item: Card | UnitBlueprint) => {
		if (isUnit(item)) {
			useUnitEditorStore.getState().loadDraft(item);
			router.push("/editor/units");
		} else {
			useCardEditorStore.getState().loadDraft(item);
			router.push("/editor/cards");
		}
	};

	return (
		<div className="flex h-screen w-full bg-zinc-950 text-zinc-200 font-sans">
			{/* SIDEBAR */}
			<div className="w-64 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col gap-2 shadow-xl z-10">
				<h1 className="text-xl font-bold mb-6 text-white tracking-wider border-b border-zinc-800 pb-4">
					Campaign Hub
				</h1>
				<TabButton
					active={activeTab === "units"}
					onClick={() => setActiveTab("units")}
				>
					Unit Blueprints
				</TabButton>
				<TabButton
					active={activeTab === "cards"}
					onClick={() => setActiveTab("cards")}
				>
					Ability Cards
				</TabButton>
			</div>

			{/* MAIN CONTENT AREA */}
			<div className="flex-1 flex flex-col p-8 overflow-y-auto relative">
				<div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800">
					<h2 className="text-3xl font-bold capitalize text-zinc-100">
						{activeTab} Database
					</h2>
					<button
						type="button"
						onClick={handleCreateNew}
						className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-md shadow-lg transition-all active:scale-95"
					>
						+ Create New {activeTab.slice(0, -1)}
					</button>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center flex-1">
						<span className="text-zinc-500 animate-pulse font-bold tracking-widest">
							LOADING DATABASE...
						</span>
					</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
						{items.map((item) => (
							<button
								type="button"
								key={item.id}
								className="group bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-lg hover:shadow-blue-900/20 transition-all cursor-pointer flex flex-col"
								onClick={() => handleEditItem(item)}
							>
								{/* Thumbnail Area */}
								<div className="h-40 bg-zinc-950 relative flex items-center justify-center p-4">
									{isUnit(item) && item.spriteBase ? (
										<Image
											src={getSprite(`${item.spriteBase}_${UnitStance.IDLE}`)}
											alt={item.name}
											fill
											className="max-h-full max-w-full object-contain drop-shadow-md"
										/>
									) : (
										<span className="text-zinc-700 font-bold text-xs uppercase tracking-widest">
											{activeTab === "cards" ? "Card Data" : "No Sprite"}
										</span>
									)}

									{/* Hover Overlay */}
									<div className="absolute inset-0 bg-blue-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
										<span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl">
											Edit Blueprint
										</span>
									</div>
								</div>

								{/* Footer Details */}
								<div className="p-3 border-t border-zinc-800 bg-zinc-900 flex flex-col">
									<h3 className="font-bold text-sm truncate text-zinc-200">
										{item.name}
									</h3>
									<p className="text-[9px] text-zinc-500 font-mono mt-1 truncate">
										{item.id}
									</p>
								</div>
							</button>
						))}

						{items.length === 0 && (
							<div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/50">
								<span className="font-bold mb-2 text-lg">
									No {activeTab} found in database.
								</span>
								<span className="text-sm">
									Click the button above to create your first one.
								</span>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
