import type { CardEditorGet } from "../cardEditor.store";

export const exportToJson = (get: CardEditorGet) => async (): Promise<void> => {
	const { draftCard } = get();
	const dataStr = JSON.stringify(draftCard, null, 2);
	const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

	const exportFileDefaultName = `${draftCard.name.toLowerCase().replace(/\s+/g, "_")}.json`;

	const linkElement = document.createElement("a");
	linkElement.setAttribute("href", dataUri);
	linkElement.setAttribute("download", exportFileDefaultName);
	linkElement.click();
	linkElement.remove();
};
