import type { UnitEditorState } from "../unitEditor.store";

export const exportToJson = (get: () => UnitEditorState) => () => {
	const { draftUnit } = get();

	const dataStr =
		"data:text/json;charset=utf-8," +
		encodeURIComponent(JSON.stringify(draftUnit, null, 2));
	const downloadAnchorNode = document.createElement("a");
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute(
		"download",
		`${draftUnit.name || "new_unit"}.json`,
	);
	document.body.appendChild(downloadAnchorNode);
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
};
