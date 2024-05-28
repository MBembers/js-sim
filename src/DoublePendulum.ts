export default class DoublePendlum {
	x0: number;
	y0: number;
	l1: number;
	l2: number;
	theta1: number;
	theta2: number;
	m1: number;
	m2: number;
	damping1: number;
	damping2: number;
	theta1_v: number;
	theta2_v: number;
	period_start: number;
	color: string;
	constructor(
		x0: number,
		y0: number,
		length1: number,
		length2: number,
		theta1: number,
		theta2: number,
		mass1: number,
		mass2: number,
		damping1: number = 0,
		damping2: number = 0
	) {
		this.x0 = x0;
		this.y0 = y0;
		this.l1 = length1;
		this.l2 = length2;
		this.theta1 = theta1;
		this.theta2 = theta2;
		this.m1 = mass1;
		this.m2 = mass2;
		this.damping1 = damping1;
		this.damping2 = damping2;
		this.theta1_v = 0;
		this.theta2_v = 0;
		this.period_start = 0;
		this.color = "white";
	}
	set_color(color: string) {
		this.color = color;
	}

	start_period(): void {
		this.period_start = performance.now();
	}

	end_period(): number {
		return performance.now() - this.period_start;
	}

	// for runge kutta method but I'll not use it right now
	// d angle/dt = angle_v
	f_theta1(): number {
		return this.theta1_v;
	}
	f_theta2(): number {
		return this.theta2_v;
	}
	// d angle_v/dt = -g/l sin(angle)
	f_theta1_v(theta1_v: number): number {
		const g = 9.81;
		let sus =
			-g * (2 * this.m1 + this.m2) * Math.sin(this.theta1) -
			this.m2 * g * Math.sin(this.theta1 - 2 * this.theta2) -
			2 *
				Math.sin(this.theta1 - this.theta2) *
				this.m2 *
				(this.theta2_v ** 2 * this.l2 + theta1_v ** 2 * this.l1 * Math.cos(this.theta1 - this.theta2));
		sus = sus / (this.l1 * 2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.theta1 - 2 * this.theta2));
		return sus;
	}

	f_theta2_v(theta2_v: number): number {
		const g = 9.81;
		let sus =
			2 *
			Math.sin(this.theta1 - this.theta2) *
			(this.theta1_v ** 2 * this.l1 * (this.m1 + this.m2) +
				g * (this.m1 + this.m2) * Math.cos(this.theta1) +
				theta2_v ** 2 * this.l2 * this.m2 * Math.cos(this.theta1 - this.theta2));
		sus = sus / (this.l2 * 2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.theta1 - 2 * this.theta2));
		return sus;
	}

	simulate(dt: number) {
		this.theta1_v += this.f_theta1_v(this.theta1_v) * dt;
		this.theta2_v += this.f_theta2_v(this.theta2_v) * dt;

		this.theta1 += this.f_theta1() * dt;
		this.theta2 += this.f_theta2() * dt;
	}

	draw(ctx: CanvasRenderingContext2D, scale: number): void {
		ctx.strokeStyle = this.color;
		ctx.fillStyle = this.color;
		ctx.lineWidth = 2;
		const x1 = this.x0 + this.l1 * Math.sin(this.theta1) * scale;
		const y1 = this.y0 + this.l1 * Math.cos(this.theta1) * scale;
		const x2 = x1 + this.l2 * Math.sin(this.theta2) * scale;
		const y2 = y1 + this.l2 * Math.cos(this.theta2) * scale;
		ctx.beginPath();
		ctx.moveTo(this.x0, this.y0);
		ctx.lineTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(x1, y1, 4, 0, 2 * Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(x2, y2, 4, 0, 2 * Math.PI);
		ctx.fill();
	}

	acceleration1(): number {
		return 0;
	}
}
