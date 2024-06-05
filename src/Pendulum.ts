export default class Pendulum {
	x: number;
	y: number;
	length: number;
	angle: number;
	mass: number;
	damping: number;
	angle_v: number;
	angle_a: number;
	period_start: number;
	color: string;
	constructor(x: number, y: number, length: number, angle: number, mass: number, damping: number) {
		this.x = x;
		this.y = y;
		this.length = length;
		this.angle = angle;
		this.mass = mass;
		this.damping = damping;
		this.angle_v = 0;
		this.angle_a = 0;
		this.period_start = 0;
		this.color = "white";
	}

	set_color(color: string) {
		this.color = color;
	}

	start_period() {
		this.period_start = performance.now();
	}

	end_period() {
		return performance.now() - this.period_start;
	}

	// for runge kutta method but I'll not use it right now
	// d angle/dt = angle_v
	f_angle(): number {
		return this.angle_v;
	}
	// d angle_v/dt = -g/l sin(angle)
	f_angle_v(): number {
		const g = 9.81;
		const l = 1;
		return (-g / l) * Math.sin(this.angle);
	}

	simulate(dt: number) {
		this.angle_v += this.f_angle_v() * dt;
		this.angle += this.f_angle() * dt;
	}

	draw(ctx: CanvasRenderingContext2D, scale: number) {
		ctx.strokeStyle = this.color;
		ctx.fillStyle = this.color;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		let x1 = this.x + this.length * Math.sin(this.angle) * scale;
		let y1 = this.y + this.length * Math.cos(this.angle) * scale;
		ctx.lineTo(x1, y1);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(x1, y1, 4, 0, 2 * Math.PI);
		ctx.fill();
	}
}
