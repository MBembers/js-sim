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
	g: number;
	period_start: number;
	color: string;
	h: number = 0.001; // step for RK4

	p_x1: number = -1;
	p_y1: number = -1;
	p_x2: number = -1;
	p_y2: number = -1;
	ctx: CanvasRenderingContext2D;
	energy_label: HTMLDivElement = document.querySelector("#energy")!;
	constructor(
		x0: number,
		y0: number,
		length1: number,
		length2: number,
		theta1: number,
		theta2: number,
		mass1: number,
		mass2: number,
		ctx: CanvasRenderingContext2D,
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
		this.g = 9.81;
		this.period_start = 0;
		this.color = "white";
		this.ctx = ctx;
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
		let sus =
			-this.g * (2 * this.m1 + this.m2) * Math.sin(this.theta1) -
			this.m2 * this.g * Math.sin(this.theta1 - 2 * this.theta2) -
			2 *
				Math.sin(this.theta1 - this.theta2) *
				this.m2 *
				(this.theta2_v ** 2 * this.l2 + theta1_v ** 2 * this.l1 * Math.cos(this.theta1 - this.theta2));
		sus = sus / (this.l1 * 2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.theta1 - 2 * this.theta2));
		return sus;
	}

	f_theta2_v(theta2_v: number): number {
		let sus =
			2 *
			Math.sin(this.theta1 - this.theta2) *
			(this.theta1_v ** 2 * this.l1 * (this.m1 + this.m2) +
				this.g * (this.m1 + this.m2) * Math.cos(this.theta1) +
				theta2_v ** 2 * this.l2 * this.m2 * Math.cos(this.theta1 - this.theta2));
		sus = sus / (this.l2 * 2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.theta1 - 2 * this.theta2));
		return sus;
	}

	simulate(frames: number, scale: number, mode: number) {
		for (let i = 0; i < frames; i++) {
			// RK4
			const k1_1 = this.f_theta1_v(this.theta1_v);
			const k2_1 = this.f_theta1_v(this.theta1_v + (this.h * k1_1) / 2);
			const k3_1 = this.f_theta1_v(this.theta1_v + (this.h * k2_1) / 2);
			const k4_1 = this.f_theta1_v(this.theta1_v + this.h * k3_1);

			const new_theta1_v = this.theta1_v + (this.h / 6) * (k1_1 + 2 * k2_1 + 2 * k3_1 + k4_1);

			const k1_2 = this.f_theta2_v(this.theta2_v);
			const k2_2 = this.f_theta2_v(this.theta2_v + (this.h * k1_2) / 2);
			const k3_2 = this.f_theta2_v(this.theta2_v + (this.h * k2_2) / 2);
			const k4_2 = this.f_theta2_v(this.theta2_v + this.h * k3_2);

			const new_theta2_v = this.theta2_v + (this.h / 6) * (k1_2 + 2 * k2_2 + 2 * k3_2 + k4_2);

			this.theta1_v = new_theta1_v;
			this.theta2_v = new_theta2_v;

			this.theta1 += this.theta1_v * this.h;
			this.theta2 += this.theta2_v * this.h;

			// MOST BASIC EULERS METHOD
			// this.theta1_v += this.f_theta1_v(this.theta1_v) * 0.001;
			// this.theta2_v += this.f_theta2_v(this.theta2_v) * 0.001;

			// this.theta1 += this.f_theta1() * 0.001;
			// this.theta2 += this.f_theta2() * 0.001;
			if (mode == 1 && i < frames - 1) continue;
			this.draw(this.ctx, scale, mode);
		}

		const y1 = this.y0 + this.l1 * Math.cos(this.theta1) * scale;
		const y2 = y1 + this.l2 * Math.cos(this.theta2) * scale;
		// kinetic
		let energy = (1 / 2) * (this.m1 * this.l1 ** 2 * this.theta1_v ** 2 + this.m2 * this.l2 ** 2 * this.theta2_v ** 2);
		// potential
		energy += this.m1 * this.g * (1000 - y1) + this.m2 * this.g * (1000 - y2);
		this.energy_label.innerHTML = energy.toFixed(0).toString();
	}

	draw(ctx: CanvasRenderingContext2D, scale: number, mode: number): void {
		const x1 = this.x0 + this.l1 * Math.sin(this.theta1) * scale;
		const y1 = this.y0 + this.l1 * Math.cos(this.theta1) * scale;
		const x2 = x1 + this.l2 * Math.sin(this.theta2) * scale;
		const y2 = y1 + this.l2 * Math.cos(this.theta2) * scale;
		if (this.p_x1 == -1) {
			this.p_x1 = x1;
			this.p_y1 = y1;
			this.p_x2 = x2;
			this.p_y2 = y2;
		}
		ctx.strokeStyle = this.color;
		ctx.fillStyle = this.color;
		if (mode == 1) {
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(this.x0, this.y0);
			ctx.lineTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(x1, y1, 5, 0, 2 * Math.PI);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(x2, y2, 5, 0, 2 * Math.PI);
			ctx.fill();
		}
		if (mode == 2) {
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.p_x2, this.p_y2);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}

		this.p_x1 = x1;
		this.p_x2 = x2;
		this.p_y1 = y1;
		this.p_y2 = y2;
	}

	acceleration1(): number {
		return 0;
	}
}
