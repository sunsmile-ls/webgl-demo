import { useEffect } from 'react';
import flashingDots from './flashingDots';
export default function DrawPoint() {
	useEffect(() => {
		document.querySelector('#vertexShader')!.innerHTML = `
      attribute vec4 a_Position;
      attribute float a_PointSize;
      void main(){
          gl_Position = a_Position;
          gl_PointSize = a_PointSize;
      }
    `;
		document.querySelector('#fragmentShader')!.innerHTML = `
      precision mediump float;
      uniform vec4 u_FragColor;
      void main() {
          float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
          if(dist < 0.5) {
              gl_FragColor = u_FragColor;
          } else {
              discard;
          }
      }
    `;
		flashingDots();
	}, []);
	return <canvas></canvas>;
}

