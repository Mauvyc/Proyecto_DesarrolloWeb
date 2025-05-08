import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Cargar variables de entorno basadas en el modo (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    // Variables globales que estarán disponibles en el código cliente
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __APP_ENV__: JSON.stringify(mode),
    },
    server: {
      // Puerto en desarrollo
      port: 5173,
      open: true,
      // Cors para desarrollo
      cors: true,
    },
    build: {
      // Configuraciones de construcción para producción
      sourcemap: mode !== 'production',
      // Optimizaciones para producción
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      // Separación de chunks
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            router: ['react-router-dom'],
          }
        }
      }
    }
  }
})
