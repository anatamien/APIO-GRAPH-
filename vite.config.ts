import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  // These pure render modules also run in a Worker, without window or HMR.
  plugins: [react({exclude:[/node_modules/,/ChartScene\.tsx$/, /PageScene\.tsx$/, /DiagramTableGeometry\.tsx$/, /SignalOverlays\.tsx$/, /svgRenderer\.tsx$/]})], clearScreen: false, build:{target:['es2022','safari16.4']},
  server: { host: '127.0.0.1', port: 1420, strictPort: true, watch:{ignored:['**/src-tauri/**','**/local-only/**','**/test-results/**']} },
  test: { include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'], environment: 'node' },
});
