const packageJson = require('../package.json')

require('esbuild').buildSync({
  entryPoints: ['./appTest.js'],
  bundle: true,
  platform: 'node',
  target: 'node12',
  external: Object.keys(packageJson.dependencies || []),
  outfile: './dist/indexTest.js',
})
