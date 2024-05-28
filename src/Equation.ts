export default class Equation {
	t: number;
	y: number;
	y_: number;
	constructor(t: number, y: number) {
		this.t = t;
		this.y = y;
		this.y_ = 0;
	}
	// d theta/dt = omega
	f(t: number, y: number): number {
		return this.y_;
	}
	// d omega/dt = -g/l sin(theta)
	f1(t: number, y_: number): number {
		const g = 9.81;
		const l = 1;
		return (-g / l) * Math.sin(this.y);
	}

	simulate(dt: number) {
		this.y_ = this.y_ + this.f1(this.t, this.y_) * dt;
		this.y = this.y + this.f(this.t, this.y) * dt;
		this.t = this.t + dt;
	}

	draw(ctx: CanvasRenderingContext2D, scale: number) {
		ctx.strokeStyle = "white";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(this.t * 20 + 100, this.y * -20 + ctx.canvas.height / 2, 2, 0, 2 * Math.PI);
		ctx.fillStyle = "white";
		ctx.fill();
	}
}
