import { initShaders, WebGLRenderingContextAndProgram, getMousePosInWebgl } from '@/jsm/Utils';
import Poly from '@/jsm/poly';
import Sky from '@/jsm/sky';
export default function renderPoly() {
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
	// 1) 创建程序对象
	// 2）创建着色器对象，并且添加到着色器对象中
	// 3）webgl 上下文和程序对象建立连接
	// 4）启动程序对象
	initShaders(gl, vsSource, fsSource);

	// 刷底色
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	//当前正在绘制的多边形
	// 5. 建立夜空对象，用于承载多边形
	const sky = new Sky(gl);
	let poly: Poly | null = null;

	//取消右击提示
	canvas.oncontextmenu = function () {
		return false;
	};
	// 鼠标点击事件
	canvas.addEventListener('mousedown', event => {
		if (event.button === 2) {
			// 右击删除最后一个点
			popVertice();
		} else {
			const { x, y } = getMousePosInWebgl(event, canvas);
			if (poly) {
				// 添加点
				poly.addVertice(x, y);
			} else {
				// 创建多边形
				crtPoly(x, y);
			}
		}
		render();
	});
	//鼠标移动
	canvas.addEventListener('mousemove', event => {
		if (poly) {
			// 去掉最后一个点，添加一个鼠标位置的当前点
			const { x, y } = getMousePosInWebgl(event, canvas);
			poly.setVertice(poly.count - 1, x, y);
			render();
		}
	});

	//删除最后一个顶点
	function popVertice() {
		poly?.popVertice();
		poly = null;
	}
	//创建多边形
	function crtPoly(x: number, y: number) {
		poly = new Poly({
			vertices: [x, y, x, y], // 由于需要连线，所以创建的需要两个点
			types: ['POINTS', 'LINE_STRIP'],
		});
		sky.add(poly);
	}
	// 渲染方法
	function render() {
		gl.clear(gl.COLOR_BUFFER_BIT);
		sky.draw();
	}
}

