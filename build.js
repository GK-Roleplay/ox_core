// @ts-check
import { createBuilder, createFxmanifest } from '@communityox/fx-utils';
import { spawn } from 'child_process';

const watch = process.argv.includes('--watch');

function exec(command) {
  return new Promise((resolve) => {
    const child = spawn(command, { stdio: 'inherit', shell: true });
    child.on('exit', (code) => resolve(code === 0));
  });
}

if (!watch) {
  // Build only declarations into package/
  const tsc = await exec(`tsc --emitDeclarationOnly --outDir package && tsc-alias`);
  if (!tsc) process.exit(0);
}

const shared = {
  bundle: true,
  logLevel: 'info',
};

createBuilder(
  watch,
  {
    dropLabels: !watch ? ['DEV'] : undefined,
  },
  [
    {
      name: 'server',
      options: {
        ...shared,
        platform: 'node',
        format: 'cjs',
        target: ['es2019'],          // safe for FiveM runtime
        entryPoints: ['server/index.ts'],
        outfile: 'dist/server.js',
      },
    },
    {
      name: 'auth',
      options: {
        ...shared,
        platform: 'node',
        format: 'cjs',
        target: ['es2019'],
        entryPoints: ['server/auth.ts'],
        outfile: 'dist/auth.js',
      },
    },
    {
      name: 'client',
      options: {
        ...shared,
        platform: 'browser',
        format: 'iife',
        target: ['es2019'],          // avoid es2023 features
        entryPoints: ['client/index.ts'],
        outfile: 'dist/client.js',
      },
    },
    {
      name: 'nui_login',
      options: {
        ...shared,
        platform: 'browser',
        format: 'iife',
        target: ['es2019'],
        entryPoints: ['client/nui_login.ts'],
        outfile: 'dist/nui_login.js',
      },
    },
  ],
  async (files) => {
    await createFxmanifest({
      client_scripts: [files.client, files.nui_login],
      server_scripts: [files.server, files.auth],
      files: [
        'lib/init.lua',
        'lib/client/**.lua',
        'locales/*.json',
        'common/data/*.json',
        'web/ui.html',
        'web/ui.js',
        'web/style.css',
        'web/peds.json',
        'web/assets/logo.png',
        'web/assets/logo.jpg',
      ],
      dependencies: ['/server:12913', '/onesync'],
      metadata: { node_version: '22' },
    });
  }
);
