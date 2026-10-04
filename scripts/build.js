// react-scripts 3 bundles webpack 4, which hashes with MD4. OpenSSL 3 (Node >= 17)
// disables MD4, so enable the legacy provider there. Node 16 rejects the flag.
const { spawnSync } = require('child_process');

const env = { ...process.env };
const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
if (nodeMajor >= 17 && !(env.NODE_OPTIONS || '').includes('--openssl-legacy-provider')) {
  env.NODE_OPTIONS = `${env.NODE_OPTIONS || ''} --openssl-legacy-provider`.trim();
}

const bin = require.resolve('react-scripts/bin/react-scripts.js');
const result = spawnSync(process.execPath, [bin, 'build'], { stdio: 'inherit', env });
process.exit(result.status === null ? 1 : result.status);
