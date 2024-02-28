import { createLogger, defineConfig, Logger } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import UnoCSS from 'unocss/vite';
import { createMpaPlugin } from 'vite-plugin-virtual-mpa';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const customLogger = (): Logger => {
  const logger = createLogger();
  return {
    ...logger,
    warn: (message, options) => {
      const regexp = new RegExp('files in the public directory are served at the root path.', 'g');
      if (regexp.test(message)) return;
      logger.info(message, options);
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  customLogger: customLogger(),
  server: {
    proxy: {
      '/l1': {
        target: 'https://sequencer.metisdevops.link',
        changeOrigin: true,
      },
      '/l2': {
        target: 'https://sequencer.metisdevops.link',
        changeOrigin: true,
      },
      '/v1': {
        target: 'https://sequencer.metisdevops.link',
        changeOrigin: true,
      }
    },
  },
  plugins: [
    react(),
    UnoCSS(),
    createMpaPlugin({
      verbose: false,
      template: 'public/index.html',
      pages: [{ name: 'index', filename: 'index.html' }],
      rewrites: [{ from: /^(?!.*charting_library).*$/i, to: '/public/index.html' }],
    }),
    nodePolyfills({ protocolImports: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
