const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('../tsconfig.json');

// This is needed for ts-node to properly resolve paths when running scripts
tsConfigPaths.register({
  baseUrl: '.',
  paths: tsConfig.compilerOptions.paths,
}); 