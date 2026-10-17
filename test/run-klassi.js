const { existsSync } = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const klassiRoot = path.resolve(root, '../klassi-js');
const cliPath = path.join(klassiRoot, 'packages/ai-cli/dist/cli.js');

async function runKlassi(args) {
  if (!existsSync(cliPath)) {
    throw new Error('klassi-js AI CLI build was not found. Build @klassijs/ai-cli before pnpm test:ai.');
  }
  const dotenv = path.join(klassiRoot, 'node_modules/dotenv');
  require(dotenv).config({ path: path.join(root, '.env') });
  const { execute } = await import(pathToFileURL(cliPath).href);
  const stdout = [];
  const stderr = [];
  const write = process.stdout.write.bind(process.stdout);
  const writeError = process.stderr.write.bind(process.stderr);
  process.stdout.write = (chunk, ...rest) => {
    stdout.push(String(chunk));
    return write(chunk, ...rest);
  };
  process.stderr.write = (chunk, ...rest) => {
    stderr.push(String(chunk));
    return writeError(chunk, ...rest);
  };
  try {
    const code = await execute(['node', 'klassi', ...args]);
    return { code, stdout: stdout.join(''), stderr: stderr.join('') };
  } finally {
    process.stdout.write = write;
    process.stderr.write = writeError;
  }
}

module.exports = { root, runKlassi };
