import { SimObject } from "./types";

export default class Scene {
	is_playing: boolean;
	scale: number;
	mode: number;
	objects: SimObject[];
	constructor(scale: number, mode: number) {
		this.is_playing = false;
		this.scale = scale;
		this.mode = mode;
		this.objects = [];
	}

	addObject(obj: SimObject) {
		this.objects.push(obj);
	}

	simulate(frames: number) {
		this.objects.forEach((obj) => obj.simulate(frames, this.scale, this.mode));
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.objects.forEach((obj) => obj.draw(ctx, this.scale, this.mode));
	}
}
