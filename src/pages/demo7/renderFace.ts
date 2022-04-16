import { initShaders, WebGLRenderingContextAndProgram, ScaleLinear } from '@/jsm/Utils'
import Poly from '@/jsm/poly'
import ShapeGeo from '@/jsm/ShapeGeo'
export default function renderFace() {
	// 1. 获取canvas
	const canvas = document.querySelector('canvas')!

	// 设置canvas的宽和高
	canvas.width = window.innerWidth - 200
	canvas.height = window.innerHeight

	// 2. 获取着色器
	const vsSource = document.getElementById('vertexShader')?.innerText
	const fsSource = document.getElementById('fragmentShader')?.innerText

	// 3. 获取webgl上下文
	const gl = canvas.getContext('webgl') as WebGLRenderingContextAndProgram

	// 4. 初始化着色器
	// 1) 创建程序对象
	// 2）创建着色器对象，并且添加到着色器对象中
	// 3）webgl 上下文和程序对象建立连接
	// 4）启动程序对象
	initShaders(gl, vsSource, fsSource)

	// 5. 刷底色
	gl.clearColor(0, 0, 0, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)

	// 6. 绘制 G 点逆时针数据结构
	const pathData = [
		0, 0, 600, 0, 600, 100, 100, 100, 100, 500, 500, 500, 500, 300, 300, 300, 300, 400, 200, 400,
		200, 200, 600, 200, 600, 600, 0, 600,
	]
	// 7. G的宽度为 600px， 高为 600px, 需要映射为 webgl中的数据结构
	const ratio = canvas.width / canvas.height
	const rectH = 1.0
	//! 除以宽高比才为长方形， 如果乘以宽高比 正方形
	const rectW = rectH / ratio

	//正方形宽高的一半
	const [halfRectW, halfRectH] = [rectW / 2, rectH / 2]
	//两个极点
	const minX = -halfRectW
	const minY = -halfRectH
	const maxX = halfRectW
	const maxY = halfRectH

	// ! 8. 建立x轴和y轴比例尺
	const scaleX = ScaleLinear(0, minX, 600, maxX)
	const scaleY = ScaleLinear(0, minY, 600, maxY)

	const glData: number[] = []
	// 转换数据
	for (let i = 0; i < pathData.length; i += 2) {
		glData.push(scaleX(pathData[i]), scaleY(pathData[i + 1]))
	}
	// 1. 显示线
	// const path = new Poly({
	// 	gl,
	// 	vertices: glData,
	// 	types: ['POINTS', 'LINE_LOOP'],
	// })
	// path.draw()

	// 2. 网格化
	const shapeGeo = new ShapeGeo(glData)
	const face = new Poly({
		gl,
		vertices: shapeGeo.vertices,
		types: ['TRIANGLES'],
	})
	face.draw()
}

