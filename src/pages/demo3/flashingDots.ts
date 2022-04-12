// 通过鼠标点击设置点的位置
import { initShaders, WebGLRenderingContextAndProgram } from '@/jsm/Utils';
import { POINT } from '@/type';
import Compose from '@/jsm/compose';
import Track from '@/jsm/Track';
import './index.css';
export default function flashingDots() {
	// 1. 获取canvase 画布
	const canvas = document.querySelector('canvas')!;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const compose = new Compose();
	// 2. 使用canvas 获取gl绘图上下文
	const gl = canvas.getContext('webgl') as WebGLRenderingContextAndProgram;

	// 3. 获取顶点着色器和片源着色器
	const vsSource = document.getElementById('vertexShader')?.innerText;
	const fsSource = document.getElementById('fragmentShader')?.innerText;
	// 4. 初始化着色器
	initShaders(gl as WebGLRenderingContextAndProgram, vsSource, fsSource);

	// 5. 获取着色器中的变量
	const a_Position = gl?.getAttribLocation(gl.program, 'a_Position');
	const a_PointSize = gl?.getAttribLocation(gl.program, 'a_PointSize');

	// 获取片元着色器中的变量
	const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

	// 6. 注册点击事件
	const g_points: Array<POINT> = [];
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
		const alpha = Math.random();
		const pointSize = Math.random() * 5 + 2;
		const obj = { x, y, alpha, pointSize };
		g_points.push(obj);
		const track = new Track(obj);
		track.start = new Date().getTime();
		track.keyMap = new Map([
			[
				'pointSize',
				[
					[500, pointSize],
					[1000, 0],
					[1500, pointSize],
				],
			],
		]);
		track.timeLen = 2000;
		track.loop = true;
		compose.add(track);

		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		// 开启片元的颜色合成功能
		gl.enable(gl.BLEND);
		// 设置片元的合成方式
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		g_points.forEach(({ x, y, pointSize, alpha }) => {
			const arr = new Float32Array([0.87, 0.91, 1, alpha]);
			gl.uniform4fv(u_FragColor, arr);
			gl.vertexAttrib2f(a_Position, x, y);
			gl.vertexAttrib1f(a_PointSize, pointSize);
			gl.drawArrays(gl.POINTS, 0, 1);
		});
	});
	function render() {
		gl.clear(gl.COLOR_BUFFER_BIT);
		g_points.forEach(({ x, y, pointSize, alpha }) => {
			gl.vertexAttrib2f(a_Position, x, y);
			gl.vertexAttrib1f(a_PointSize, pointSize);
			gl.uniform4fv(u_FragColor, new Float32Array([0.87, 0.92, 1, alpha]));
			gl.drawArrays(gl.POINTS, 0, 1);
		});
	}
	function ani() {
		compose.update(new Date().getTime());
		render();
		requestAnimationFrame(ani);
	}
	ani();
}

