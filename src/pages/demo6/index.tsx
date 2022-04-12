import { useEffect } from 'react';
import renderConstellation from './renderConstellation';

export default function index() {
	useEffect(() => {
		document.querySelector('#vertexShader')!.innerHTML = `
			attribute vec4 a_Attr;
			varying float v_Alpha;
			void main(){
					gl_Position=vec4(a_Attr.x,a_Attr.y,0.0,1.0);
					gl_PointSize=a_Attr.z;
					v_Alpha=a_Attr.w;
			}
    `;
		document.querySelector('#fragmentShader')!.innerHTML = `
			precision mediump float;
			varying float v_Alpha;
			void main(){
					float dist=distance(gl_PointCoord,vec2(0.5,0.5));
					if(dist<0.5){
						gl_FragColor=vec4(0.87,0.91,1.0,v_Alpha);
					}else{
						discard;
					}
			}
    `;
		renderConstellation();
	}, []);
	return <canvas></canvas>;
}

