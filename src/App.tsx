import { useState } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import ClearColor from './pages/demo1';
import DrawPoint from './pages/demo2';
import FlashingDots from './pages/demo3';
import RenderAsync from './pages/demo4';
import RenderPoly from './pages/demo5';
import RenderConstellation from './pages/demo6';
import './App.css';

function App() {
	return (
		<BrowserRouter>
			<div className='container'>
				<section>
					<ul className='link'>
						<li>
							<Link to='clearColor'>1. 刷底色</Link>
						</li>
						<li>
							<Link to='drawPoint'>2. 绘制点</Link>
						</li>
						<li>
							<Link to='flashingDots'>3. 绘制闪烁的点</Link>
						</li>
						<li>
							<Link to='renderAsync'>4. 异步绘制</Link>
						</li>
						<li>
							<Link to='renderPoly'>5. 绘制多边形</Link>
						</li>
						<li>
							<Link to='renderConstellation'>6. 绘制星座</Link>
						</li>
					</ul>
				</section>
				<main>
					<Routes>
						<Route path='clearColor' element={<ClearColor />} />
						<Route path='drawPoint' element={<DrawPoint />} />
						<Route path='flashingDots' element={<FlashingDots />} />
						<Route path='renderAsync' element={<RenderAsync />} />
						<Route path='renderPoly' element={<RenderPoly />} />
						<Route path='renderConstellation' element={<RenderConstellation />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}

export default App;

