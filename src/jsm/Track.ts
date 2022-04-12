import { POINT } from '@/type';
import Compose from './compose';

export default class Track {
	start: number;
	timeLen: number;
	loop: boolean;
	target: POINT;
	parent: Compose | null;
	keyMap: Map<keyof POINT, [number, number][]>;
	constructor(target: POINT) {
		this.target = target;
		this.parent = null;
		this.start = 0;
		this.timeLen = 5;
		this.loop = false;
		this.keyMap = new Map();
	}

	update(t: number) {
		const { keyMap, timeLen, target, loop } = this;
		let time = t - this.start;
		if (loop) {
			time = time % timeLen;
		}
		keyMap.forEach((fms, key) => {
			const last = fms.length - 1;
			if (time < fms[0][0]) {
				target[key] = fms[0][1];
			} else if (time > fms[last][0]) {
				target[key] = fms[last][1];
			} else {
				target[key] = getValBetweenFms(time, fms, last);
			}
		});
	}
}

function getValBetweenFms(time: number, fms: [number, number][], last: number): number {
	for (let i = 0; i < last; i++) {
		const fm1 = fms[i];
		const fm2 = fms[i + 1];
		if (time >= fm1[0] && time <= fm2[0]) {
			const delta = {
				x: fm2[0] - fm1[0],
				y: fm2[1] - fm1[1],
			};
			const k = delta.y / delta.x;
			const b = fm1[1] - fm1[0] * k;
			return k * time + b;
		}
	}
	return 0;
}

