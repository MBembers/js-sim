import Scene from "./Scene.ts";
import DoublePendlum from "./DoublePendulum.ts";

export default class Simulation {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	fps_label: HTMLElement;
	start_button: HTMLButtonElement;
	scene: Scene;

	prev_t: number;
	frames: number = 2000;

	constructor() {
		this.canvas = document.querySelector<HTMLCanvasElement>("#sim-canvas")!;
		this.fps_label = document.querySelector<HTMLElement>("#fps")!;
		this.start_button = document.querySelector<HTMLButtonElement>("#start-btn")!;
		this.ctx = this.canvas.getContext("2d", { alpha: true })!;
		// scene setup -----------------------------------------------------
		this.scene = new Scene(this.canvas.width / 4.2, 1);
		this.prev_t = 0;
		this.setupControls();
		this.setupScene();
	}

	update(): void {
		if (this.scene.is_playing) this.clear();

		let now = performance.now();
		if (this.scene.is_playing) this.scene.simulate(this.frames);
		let calc_time = performance.now() - now;

		this.fps_label.innerHTML = `Frames: ${this.frames} Calc time: ${calc_time.toFixed(2)}ms`;
		requestAnimationFrame(() => this.update());
	}

	clear(): void {
		this.ctx.fillStyle = "#222";
		if (this.scene.mode == 1) this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "white";
	}

	setupScene(): void {
		// let dp1 = new DoublePendlum(this.canvas.width / 2, this.canvas.height / 2, 1, 1, Math.PI, Math.PI / 2, 1, 1);
		// dp1.set_color("red");
		// this.scene.addObject(dp1);
		let dp2 = new DoublePendlum(this.canvas.width / 2, this.canvas.height / 2, 1, 1, Math.PI, Math.PI / 2, 1, 1, this.ctx);
		dp2.set_color(`rgba(150, 100, 255, 0.5)`);
		this.scene.addObject(dp2);
		this.ctx.fillStyle = "#222";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	setupControls(): void {
		this.start_button.onclick = () => {
			this.scene.mode = Number.parseInt(document.querySelector<HTMLInputElement>("#mode")!.value);
			this.frames = Number.parseInt(document.querySelector<HTMLInputElement>("#frames")!.value);
			this.scene.is_playing = !this.scene.is_playing;
			this.start_button.innerHTML = this.scene.is_playing ? "Pause" : "Start";
		};
	}

	start(): void {
		this.update();
	}
}
