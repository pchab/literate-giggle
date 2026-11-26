/**
 * Recolours a sprite's clothes to a target hue while leaving skin alone.
 * Skin = warm hue, fairly bright, moderately saturated. Everything else that is
 * saturated enough (cloth, leather, hair) takes the target hue.
 * Results are cached per (src, hue) as object URLs.
 */

export type RecolorProfile = {
	/** Warm hues up to this angle (and above 345°) can be skin. */
	skinHueMax: number;
	/** Minimum brightness for skin. Painted portraits have darker skin. */
	skinV: number;
	skinSMin: number;
	/** Pixels below this saturation (greys, metal, backgrounds) stay as they are. */
	minS: number;
	/** Saturation multiplier on recoloured pixels. */
	boost: number;
};

/** Tuned on the hero pixel sprites. */
export const SPRITE_PROFILE: RecolorProfile = {
	skinHueMax: 45,
	skinV: 0.55,
	skinSMin: 0.18,
	minS: 0.15,
	boost: 1.4,
};
/** Tuned on the painted portraits (darker skin, muted backgrounds). */
export const PORTRAIT_PROFILE: RecolorProfile = {
	skinHueMax: 50,
	skinV: 0.3,
	skinSMin: 0.12,
	minS: 0.25,
	boost: 1.6,
};

export const profileFor = (src: string) =>
	src.includes("/portraits/") ? PORTRAIT_PROFILE : SPRITE_PROFILE;

const done = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

const keyOf = (src: string, hue: number) => `${src}|${hue}`;

export const getRecoloredSync = (src: string, hue: number) =>
	done.get(keyOf(src, hue));

export function recolorClothes(src: string, hue: number): Promise<string> {
	const key = keyOf(src, hue);
	const cached = done.get(key);
	if (cached) return Promise.resolve(cached);
	const inFlight = pending.get(key);
	if (inFlight) return inFlight;

	const job = loadImage(src)
		.then((img) => {
			const canvas = document.createElement("canvas");
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			const ctx = canvas.getContext("2d", { willReadFrequently: true });
			if (!ctx) throw new Error("No 2d context");
			ctx.drawImage(img, 0, 0);
			const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
			recolorPixels(data.data, hue, profileFor(src));
			ctx.putImageData(data, 0, 0);
			return new Promise<string>((resolve, reject) =>
				canvas.toBlob((blob) => {
					if (!blob) return reject(new Error("toBlob failed"));
					resolve(URL.createObjectURL(blob));
				}, "image/png"),
			);
		})
		.then((url) => {
			done.set(key, url);
			pending.delete(key);
			return url;
		})
		.catch((error) => {
			pending.delete(key);
			throw error;
		});

	pending.set(key, job);
	return job;
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

/** In-place HSV recolour on RGBA bytes. */
export function recolorPixels(
	px: Uint8ClampedArray,
	targetHue: number,
	profile: RecolorProfile = SPRITE_PROFILE,
) {
	const { skinHueMax, skinV, skinSMin, minS, boost } = profile;
	for (let i = 0; i < px.length; i += 4) {
		if (px[i + 3] === 0) continue;
		const r = px[i] / 255;
		const g = px[i + 1] / 255;
		const b = px[i + 2] / 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const v = max;
		const d = max - min;
		const s = max === 0 ? 0 : d / max;
		let h = 0;
		if (d !== 0) {
			if (max === r) h = ((g - b) / d) % 6;
			else if (max === g) h = (b - r) / d + 2;
			else h = (r - g) / d + 4;
			h *= 60;
			if (h < 0) h += 360;
		}

		const isSkin =
			(h < skinHueMax || h > 345) && v > skinV && s > skinSMin && s < 0.7;
		if (isSkin || s <= minS || v <= 0.08) continue;

		const [nr, ng, nb] = hsvToRgb(targetHue, Math.min(1, s * boost), v);
		px[i] = nr;
		px[i + 1] = ng;
		px[i + 2] = nb;
	}
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
	const c = v * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v - c;
	let r = 0;
	let g = 0;
	let b = 0;
	if (h < 60) [r, g, b] = [c, x, 0];
	else if (h < 120) [r, g, b] = [x, c, 0];
	else if (h < 180) [r, g, b] = [0, c, x];
	else if (h < 240) [r, g, b] = [0, x, c];
	else if (h < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];
	return [
		Math.round((r + m) * 255),
		Math.round((g + m) * 255),
		Math.round((b + m) * 255),
	];
}
