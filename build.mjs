// build.mjs — bundle-only build for FiveM
import { rmSync, mkdirSync } from 'node:fs';
import * as esbuild from 'esbuild';

// clean
try { rmSync('dist', { recursive: true, force: true }); } catch {}
mkdirSync('dist', { recursive: true });

const shared = {
  bundle: true,
  logLevel: 'info',
  keepNames: true, 
  treeShaking: false,     // helps logs
  // esbuild reads baseUrl/paths from tsconfig.json
};

// SERVER (CommonJS + BigInt support)
// SERVER (CommonJS + BigInt support)
await esbuild.build({
  ...shared,
  platform: 'node',
  format: 'cjs',
  target: ['es2020'], // <- BigInt literals OK
  entryPoints: ['server/index.ts'],
  outfile: 'dist/server.js',
  banner: { js: '(function(){' },   // <--- wrap everything in IIFE
  footer: { js: '})();' },          // <--- end wrapper
});

await esbuild.build({
  ...shared,
  platform: 'node',
  format: 'cjs',
  target: ['es2020'], // <- BigInt literals OK
  entryPoints: ['server/auth.ts'],
  outfile: 'dist/auth.js',
  banner: { js: '(function(){' },   // <--- wrap everything in IIFE
  footer: { js: '})();' },          // <--- end wrapper
});

// CLIENT (Chromium)
await esbuild.build({
  ...shared,
  platform: 'browser',
  format: 'iife',
  target: ['es2019'],
  entryPoints: ['client/index.ts'],
  outfile: 'dist/client.js',
});

await esbuild.build({
  ...shared,
  platform: 'browser',
  format: 'iife',
  target: ['es2019'],
  entryPoints: ['client/nui_login.ts'],
  outfile: 'dist/nui_login.js',
});

// // CLIENT: spawn
await esbuild.build({
  ...shared,
  platform: 'browser',
  format: 'iife',
  target: ['es2019'],
  entryPoints: ['client/spawn.ts'],
  outfile: 'dist/spawn.js',
});

// CLIENT: nui_bridge
await esbuild.build({
  ...shared,
  platform: 'browser',
  format: 'iife',
  target: ['es2019'],
  entryPoints: ['client/nui_bridge.ts'],
  outfile: 'dist/nui_bridge.js',
});

// CLIENT: preview
await esbuild.build({
  ...shared,
  platform: 'browser',
  format: 'iife',
  target: ['es2019'],
  entryPoints: ['client/preview.ts'],
  outfile: 'dist/preview.js',
});

console.log('\n✅ Build complete: dist/server.js, dist/auth.js, dist/client.js, dist/nui_login.js\n');
