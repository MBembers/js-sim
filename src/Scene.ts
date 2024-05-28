import { SimObject } from "./types";

export default class Scene {
	is_playing: boolean;
	clear_screen: boolean;
	scale: number;
	objects: SimObject[];
	constructor(scale: number) {
		this.clear_screen = true;
		this.is_playing = false;
		this.scale = scale;
		this.objects = [];
	}

	addObject(obj: SimObject) {
		this.objects.push(obj);
	}

	simulate(dt: number) {
		this.objects.forEach((obj) => obj.simulate(dt));
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.objects.forEach((obj) => obj.draw(ctx, this.scale));
	}
}
