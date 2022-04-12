import { useEffect } from 'react';
import clearColors from './clearColor';

export default function clearColor() {
	useEffect(() => {
		clearColors();
	}, []);
	return <canvas></canvas>;
}

