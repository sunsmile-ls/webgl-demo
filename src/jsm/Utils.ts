export interface WebGLRenderingContextAndProgram extends WebGLRenderingContext {
	program: WebGLProgram
}
export function initShaders(
	gl: WebGLRenderingContextAndProgram,
	vsSource: string | undefined,
	fsSource: string | undefined
) {
	//创建程序对象
	const program = gl.createProgram()!
	// 建立着色对象
	// 手绘板里用于接收触控笔信号的零部件，二者可以分工合作，
	// 把触控笔的压感（js信号）解析为计算机语言(GLSL ES)，然后让计算机(浏览器的webgl 渲染引擎)识别显示
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
	//把顶点着色对象装进程序对象中
	if (vertexShader) gl.attachShader(program, vertexShader)
	//把片元着色对象装进程序对象中
	if (fragmentShader) gl.attachShader(program, fragmentShader)
	//连接webgl上下文对象和程序对象
	gl.linkProgram(program)
	//启动程序对象
	gl.useProgram(program)
	//将程序对象挂到上下文对象上
	gl.program = program
	return true
}

function loadShader(
	gl: WebGLRenderingContextAndProgram,
	type: number | undefined,
	source: string | undefined
) {
	if (typeof type === 'undefined' || typeof source === 'undefined') return null
	//根据着色类型，建立着色器对象
	const shader = gl.createShader(type)!
	//将着色器源文件传入着色器对象中
	gl.shaderSource(shader, source)
	//编译着色器对象
	gl.compileShader(shader)
	//返回着色器对象
	return shader
}

export function getMousePosInWebgl(
	event: MouseEvent,
	canvas: HTMLCanvasElement
): { x: number; y: number } {
	const { clientX, clientY } = event
	// 获取canvas距离可视区的位置
	const { top, left, width, height } = canvas.getBoundingClientRect()
	// 获取点击位置基于画布的css位置
	const [cssX, cssY] = [clientX - left, clientY - top]
	const [halfWidth, halfHeight] = [width / 2, height / 2]
	// 基于webgl 的位置
	const [xBaseCenter, yBaseCenter] = [cssX - halfWidth, cssY - halfHeight]
	//  切换Y轴变量
	const yBaseCenterTop = -yBaseCenter
	// 计算x,y
	const [x, y] = [xBaseCenter / halfWidth, yBaseCenterTop / halfHeight]
	return {
		x,
		y,
	}
}
export function glToCssPos(
	pos: { x: number; y: number },
	widthAndHeight: {
		width: number
		height: number
	}
) {
	const { x, y } = pos
	const { width, height } = widthAndHeight
	const [halfWidth, halfHeight] = [width / 2, height / 2]
	return {
		x: x * halfWidth,
		y: -y * halfHeight,
	}
}

export function ScaleLinear(ax: number, ay: number, bx: number, by: number) {
	const delta = {
		x: bx - ax,
		y: by - ay,
	}
	const k = delta.y / delta.x
	const b = ay - ax * k
	return function (x: number) {
		return k * x + b
	}
}

