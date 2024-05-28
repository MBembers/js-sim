import Scene from "./Scene.ts";
import Pendulum from "./Pendulum.ts";
import Equation from "./Equation.ts";
import DoublePendlum from "./DoublePendulum.ts";

export default class Simulation {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	fps_label: HTMLElement;
	start_button: HTMLButtonElement;
	scene: Scene;

	prev_t: number;

	constructor() {
		this.canvas = document.querySelector<HTMLCanvasElement>("#sim-canvas")!;
		this.fps_label = document.querySelector<HTMLElement>("#fps")!;
		this.start_button = document.querySelector<HTMLButtonElement>("#start-btn")!;
		this.ctx = this.canvas.getContext("2d", { alpha: false })!;

		// scene setup -----------------------------------------------------
		this.scene = new Scene(180);
		this.prev_t = 0;
		this.setupControls();
		this.setupScene();
	}

	update(): void {
		let delta = (performance.now() - this.prev_t) / 1000;
		this.prev_t = performance.now();
		let fps = 1 / delta;

		let now = performance.now();
		if (this.scene.is_playing) this.scene.simulate(delta);
		let calc_time = performance.now() - now;

		now = performance.now();
		if (this.scene.is_playing) this.draw();
		let draw_time = performance.now() - now;

		this.fps_label.innerHTML = `FPS: ${fps.toFixed(0)} Calc time: ${calc_time.toFixed(2)}ms Draw time: ${draw_time.toFixed(0)}ms`;
		requestAnimationFrame(() => this.update());
	}

	draw(): void {
		if (this.scene.clear_screen) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "white";
		this.scene.draw(this.ctx);
	}

	setupScene(): void {
		let dp1 = new DoublePendlum(this.canvas.width / 2, this.canvas.height / 2, 1, 1, Math.PI / 2, Math.PI / 2, 1, 1);
		dp1.set_color("red");
		this.scene.addObject(dp1);
		let dp2 = new DoublePendlum(this.canvas.width / 2, this.canvas.height / 2, 1, 1, Math.PI / 2 + 0.0001, Math.PI / 2, 1, 1);
		dp2.set_color("blue");
		this.scene.addObject(dp2);
		// let p = new Pendulum(this.canvas.width / 2, this.canvas.height / 2, 1, Math.PI / 3, 1, 0);
		// p.set_color("blue");
		// this.scene.addObject(p);

		// this.scene.addObject(new Equation(-4, -1));
	}

	setupControls(): void {
		this.start_button.onclick = () => {
			this.scene.is_playing = !this.scene.is_playing;
			this.start_button.innerHTML = this.scene.is_playing ? "Pause" : "Start";
		};
	}

	start(): void {
		this.update();
	}
}
