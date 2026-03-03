import { getImageProps } from "next/image";

export function getBackgroundImage(
	imagePath: string,
	width: number,
	height: number,
) {
	const {
		props: { srcSet = "" },
	} = getImageProps({ alt: "", width, height, src: imagePath });
	const imageSet = srcSet
		.split(", ")
		.map((str) => {
			const [url, dpi] = str.split(" ");
			return `url("${url}") ${dpi}`;
		})
		.join(", ");
	return `image-set(${imageSet})`;
}
