import { useEffect } from 'react';
import renderAsync from './renderAsync';

export default function index() {
	useEffect(() => {
		document.querySelector('#vertexShader')!.innerHTML = `
      attribute vec4 a_Position;
      void main(){
          gl_Position = a_Position;
          gl_PointSize = 20.0;
      }
    `;
		document.querySelector('#fragmentShader')!.innerHTML = `
      precision mediump float;
			void main() {
				gl_FragColor = vec4(1.0,1.0,0,1);
			}
    `;
		renderAsync();
	}, []);
	return <canvas></canvas>;
}

