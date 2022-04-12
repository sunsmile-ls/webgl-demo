// title: 刷底色
// 通过鼠标点击设置点的位置
import { initShaders, WebGLRenderingContextAndProgram } from '../../jsm/Utils';

export default function drawpoint() {
	// 1. 获取canvase 画布
	const canvas = document.querySelector('canvas')!;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// 2. 使用canvas 获取gl绘图上下文
	const gl = canvas.getContext('webgl') as WebGLRenderingContextAndProgram;

	// 3. 获取顶点着色器和片源着色器内容
	const vsSource = document.getElementById('vertexShader')?.innerText;
	const fsSource = document.getElementById('fragmentShader')?.innerText;
	// 4. 初始化着色器
	initShaders(gl as WebGLRenderingContextAndProgram, vsSource, fsSource);

	// 5. 获取顶点着色器中的变量
	const a_Position = gl?.getAttribLocation(gl.program, 'a_Position');

	// 6. 指定将要用来清空绘图区的颜色
	gl?.clearColor(0, 0, 0, 1);
	// 7. 使用之前指定的颜色清空绘图区
	gl?.clear(gl.COLOR_BUFFER_BIT);

	// 8. 注册点击事件
	const g_points: Array<{ x: number; y: number }> = [];
	canvas.addEventListener('click', function (e) {
		const { clientX, clientY } = e;
		// 获取canvas距离可视区的位置
		const { top, left, width, height } = canvas.getBoundingClientRect();
		// 获取点击位置基于画布的css位置
		const [cssX, cssY] = [clientX - left, clientY - top];
		const [halfWidth, halfHeight] = [width / 2, height / 2];
		// 基于webgl 的位置
		const [xBaseCenter, yBaseCenter] = [cssX - halfWidth, cssY - halfHeight];
		//  切换Y轴变量
		const yBaseCenterTop = -yBaseCenter;
		// 计算x,y
		const [x, y] = [xBaseCenter / halfWidth, yBaseCenterTop / halfHeight];
		g_points.push({ x, y });
		gl.clear(gl.COLOR_BUFFER_BIT);
		g_points.forEach(({ x, y }) => {
			gl.vertexAttrib2f(a_Position, x, y);
			gl.drawArrays(gl.POINTS, 0, 1);
		});
	});
}

