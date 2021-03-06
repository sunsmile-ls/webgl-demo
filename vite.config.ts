import path from 'path'
import react from '@vitejs/plugin-react'

export default {
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '/src'),
		},
	},
	port: 3001,
	plugins: [react()],
}

