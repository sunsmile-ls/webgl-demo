// title: 刷底色

function clearColors() {
	// 1. 获取元素
	const canvas: HTMLCanvasElement = document.querySelector('canvas')!;
	// 2. 设置画布的宽高
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	// 3. 获取三维画笔
	const gl = canvas.getContext('webgl');
	// 4. 指定将要用来清空绘图区的颜色
	gl?.clearColor(0, 0, 0, 1);
	// 5. 使用之前指定的颜色清空绘图区
	gl?.clear(gl.COLOR_BUFFER_BIT);

	// 一、 获取色彩值
	const rgbCSS = 'rgba(255,255,0,1)';
	const reg = new RegExp(/\((.*)\)/);
	const rgbStr = reg.exec(rgbCSS)![1];
	const rgb = rgbStr.split(',').map(ele => parseInt(ele));
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const a = rgb[3];
	gl?.clearColor(r, g, b, a);
	gl?.clear(gl.COLOR_BUFFER_BIT);

	// 二、多彩斑斓的色彩
	// 1. 定义颜色
	// const color = new Color(1, 0, 0);
	// !(function ani() {
	// 	color.offsetHSL(0.005, 0, 0);
	// 	gl?.clearColor(color.r, color.g, color.b, 1);
	// 	gl?.clear(gl.COLOR_BUFFER_BIT);
	// 	requestAnimationFrame(ani);
	// })();
}
export default clearColors;

