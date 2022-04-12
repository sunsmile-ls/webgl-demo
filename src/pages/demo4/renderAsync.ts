import { initShaders, WebGLRenderingContextAndProgram } from '@/jsm/Utils';
import Poly from '@/jsm/poly';

export default function renderAsync() {
	// 1. 获取canvas
	const canvas = document.querySelector('canvas')!;

	// 设置canvas的宽和高
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// 2. 获取着色器
	const vsSource = document.getElementById('vertexShader')?.innerText;
	const fsSource = document.getElementById('fragmentShader')?.innerText;

	// 3. 获取webgl上下文
	const gl = canvas.getContext('webgl') as WebGLRenderingContextAndProgram;

	// 4. 初始化着色器
	initShaders(gl, vsSource, fsSource);

	// 顶点数据
	let points = [0, 0.2];

	// 创建缓存区对象
	const vertexBuffer = gl.createBuffer();
	// 绑定缓存区对象
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	//  写入数据
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

	// 将缓存区对象分配给attribute变量
	const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	// 开启批处理能力
	gl.enableVertexAttribArray(a_Position);

	// 刷底色
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.POINTS, 0, 1);

	// 异步绘制

	// setTimeout(() => {
	// 	points.push(-0.2, -0.1);
	// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
	// 	gl.clear(gl.COLOR_BUFFER_BIT);
	// 	gl.drawArrays(gl.POINTS, 0, 2);
	// }, 1000);

	// setTimeout(() => {
	// 	gl.clear(gl.COLOR_BUFFER_BIT);
	// 	gl.drawArrays(gl.POINTS, 0, 2);
	// 	gl.drawArrays(gl.LINE_STRIP, 0, 2);
	// }, 2000);

	const poly = new Poly({
		gl,
		vertices: [0, 0.2],
	});
	poly.draw(['POINTS']);

	setTimeout(() => {
		poly.addVertice(-0.4, -0.1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		poly.draw(['POINTS']);
	}, 1000);

	setTimeout(() => {
		gl.clear(gl.COLOR_BUFFER_BIT);
		poly.draw(['POINTS', 'LINE_STRIP']);
	}, 2000);
}

