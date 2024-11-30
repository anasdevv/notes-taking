// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '');
  // console.log('env ', env);
  // Log the environment variables to debug

  // Explicitly set base path, defaulting to '/' if not set
  const basePath = env?.VITE_BASE_PATH || '/';

  return {
    base: basePath,
    plugins: [react()],
    // Optional: additional logging in build
    build: {
      rollupOptions: {
        output: {
          onwarn(warning, warn) {
            console.log('Base Path:', basePath);
            warn(warning);
          },
        },
      },
    },
  };
});

// // Additional debugging in your main entry point
// // main.jsx or main.tsx
// console.log('Import.meta.env.BASE_URL:', import.meta.env.BASE_URL);
// console.log('Import.meta.env.VITE_BASE_PATH:', import.meta.env.VITE_BASE_PATH);
