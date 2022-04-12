import {
	initShaders,
	WebGLRenderingContextAndProgram,
	getMousePosInWebgl,
	glToCssPos,
} from '@/jsm/Utils';
import Poly from '@/jsm/poly';
import Sky from '@/jsm/sky';
import Track from '@/jsm/Track';
import Compose from '@/jsm/compose';
import { POINT } from '@/type';
export default function renderConstellation() {
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

	// 6. 建立合成对象，用于对顶点数据做补间运算
	const compose = new Compose();

	// 7. 声明两个变量，用于表示当前正在绘制的多边形和鼠标划上的点
	let poly: Poly | null = null;
	let point: POINT | null = null;

	// 8. 取消右击提示
	canvas.oncontextmenu = function () {
		return false;
	};
	// 9. 鼠标点击事件
	canvas.addEventListener('mousedown', event => {
		if (event.button === 2) {
			// 右击删除最后一个点
			poly && popVertice();
		} else {
			const { x, y } = getMousePosInWebgl(event, canvas);
			if (poly) {
				// 添加点
				addVertice(x, y);
			} else {
				// 创建多边形
				crtPoly(x, y);
			}
		}
		render();
	});
	// 10. 鼠标移动
	canvas.addEventListener('mousemove', event => {
		const { x, y } = getMousePosInWebgl(event, canvas);
		point = hoverPoint(x, y);
		if (point) {
			canvas.style.cursor = 'pointer';
		} else {
			canvas.style.cursor = 'default';
		}
		if (poly) {
			const obj = poly.geoData![poly.geoData!.length - 1];
			obj.x = x;
			obj.y = y;
		}
	});

	//删除最后一个顶点
	function popVertice() {
		poly?.geoData!.pop();
		compose.children.pop();
		poly = null;
	}
	function addVertice(x: number, y: number) {
		const geoData = poly?.geoData!;
		if (point) {
			geoData[geoData.length - 1] = point;
		}
		let obj = { x, y, pointSize: random(), alpha: 1 };
		geoData.push(obj);
		crtTrack(obj);
	}
	// 检测所有顶点的鼠标划入，返回顶点数据
	function hoverPoint(mx: number, my: number) {
		for (let { geoData } of sky.children) {
			for (let obj of geoData!) {
				if (poly && obj === poly.geoData![poly.geoData!.length - 1]) {
					continue;
				}
				const delta = {
					x: mx - obj.x,
					y: my - obj.y,
				};
				// webgl坐标系，转换为css坐标系
				const { x, y } = glToCssPos(delta, canvas);
				const dist = x * x + y * y;
				if (dist < 100) {
					return obj;
				}
			}
		}
		return null;
	}
	//创建多边形
	function crtPoly(x: number, y: number) {
		let o1 = point ? point : { x, y, pointSize: random(), alpha: 1 };
		const o2 = { x, y, pointSize: random(), alpha: 1 };
		poly = new Poly({
			size: 4,
			attrName: 'a_Attr',
			geoData: [o1, o2],
			types: ['POINTS', 'LINE_STRIP'],
		});
		sky.add(poly);
		crtTrack(o1);
		crtTrack(o2);
	}
	function random() {
		return Math.random() * 8.0 + 3.0;
	}
	// ! 为星星添加动画
	function crtTrack(obj: POINT) {
		const { pointSize } = obj;
		const track = new Track(obj);
		track.start = new Date().getTime();
		track.timeLen = 2000;
		track.loop = true;
		track.keyMap = new Map([
			[
				'pointSize',
				[
					[500, pointSize],
					[1000, 0],
					[1500, pointSize],
				],
			],
			[
				'alpha',
				[
					[500, 1],
					[1000, 0],
					[1500, 1],
				],
			],
		]);
		compose.add(track);
	}
	// 渲染方法
	function render() {
		gl.clear(gl.COLOR_BUFFER_BIT);
		sky.draw();
	}

	function ani() {
		// 更新动画
		compose.update(new Date().getTime());
		// 计算新的数组
		sky.updateVertices(['x', 'y', 'pointSize', 'alpha']);
		render();
		requestAnimationFrame(ani);
	}
	ani();
}

