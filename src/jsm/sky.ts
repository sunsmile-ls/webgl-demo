import { WebGLRenderingContextAndProgram } from './Utils';
import Poly from './poly';
import { POINT } from '@/type';
export default class Sky {
	// gl webgl上下文对象
	gl: WebGLRenderingContextAndProgram;
	// children 子级
	children: Poly[];
	constructor(gl: WebGLRenderingContextAndProgram) {
		this.gl = gl;
		this.children = [];
	}
	// 添加子对象
	add(obj: Poly) {
		obj.gl = this.gl;
		this.children.push(obj);
	}
	// 更新子对象的顶点数据
	updateVertices(params: (keyof POINT)[]) {
		this.children.forEach(ele => {
			ele.updateVertices(params);
		});
	}
	// 遍历子对象绘图，每个子对象对应一个buffer 对象，所以在子对象绘图之前要先初始化。
	draw() {
		this.children.forEach(ele => {
			ele.init();
			ele.draw();
		});
	}
}

