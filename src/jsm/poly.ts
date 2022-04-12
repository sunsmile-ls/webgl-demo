import { POINT } from '@/type';
import { WebGLRenderingContextAndProgram } from './Utils';
interface AttrInterface {
	gl?: WebGLRenderingContextAndProgram | undefined;
	vertices?: number[] | undefined;
	geoData?: POINT[] | undefined;
	size?: number; // 顶点分量的数目
	attrName?: string; // 代表顶点位置的 attribute 变量名
	count?: number; //  顶点数量
	types?: string[]; // 绘图方式，可以用多种方式绘图
}
export default class Poly {
	gl: WebGLRenderingContextAndProgram | undefined; // webgl 上下文对象
	/**
	* vertices 顶点数据集合，在被赋值的时候会做两件事
		- 更新 count 顶点数量，数据运算尽量不放渲染方法里
		- 向缓冲区内写入顶点数据
	*/
	vertices: number[] = [];
	geoData!: POINT[] | null; // 模型数据，对象数组，可解析出 vertices 顶点数据
	// 模型数据，对象数组，可解析出 vertices 顶点数据
	size: number = 2; // 顶点分量的数目
	attrName: string = 'a_Position'; // 代表顶点位置的 attribute 变量名
	count: number = 0; //  顶点数量
	types: string[] = ['POINTS']; // 绘图方式，可以用多种方式绘图

	constructor(attr: AttrInterface) {
		Object.assign(this, attr);
		this.init();
	}
	// 初始化方法，建立缓冲对象，并将其绑定到 webgl 上下文对象上，然后向其中写入顶点数据。
	// 将缓存区对象分配给attribute变量，并开启 attribute 变量的批处理功能。
	// ! 重新计算数据
	init() {
		const { attrName, size, gl } = this;
		if (!gl) {
			return;
		}
		const vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		this.updateBuffer();
		const a_Position = gl.getAttribLocation(gl.program, attrName);
		gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);
	}
	// 添加顶点
	addVertice(...params: number[]) {
		// 又添加一个最新的变量进去，最新的那个节点会不断的跟新
		// 倒数第二个节点变成固定的
		this.vertices.push(...params);
		this.updateBuffer();
	}
	// 删除最后一个顶点
	popVertice() {
		const { vertices, size } = this;
		const len = vertices.length;
		vertices.splice(len - size, len);
		this.updateCount();
	}

	//从索引位置添加数据
	setVertice(count: number, ...params: number[]) {
		const { vertices, size } = this;
		const i = count * size;
		params.forEach((param, paramInd) => {
			vertices[i + paramInd] = param;
		});
	}
	// 更新缓冲区数据，同时更新顶点数量
	updateBuffer() {
		const { gl, vertices } = this;
		if (!gl) return;
		this.updateCount();
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	}
	// 更新顶点数量
	updateCount() {
		this.count = this.vertices.length / this.size;
	}
	// 基于 geoData 解析出 vetices 数据
	updateVertices(params: (keyof POINT)[]) {
		const geoData = this.geoData!;
		const vertices: number[] = [];
		geoData.forEach(data => {
			params.forEach((key: keyof POINT) => {
				vertices.push(data[key]);
			});
		});
		this.vertices = vertices;
	}
	// 绘图方法
	draw(types = this.types) {
		const { gl, count } = this;
		if (!gl) return;
		console.log(count);
		for (let type of types) {
			const number = gl[type as keyof WebGLRenderingContextAndProgram] as number;
			gl.drawArrays(number, 0, count);
		}
	}
}

