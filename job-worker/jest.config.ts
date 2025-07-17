const { createDefaultPreset, pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    ...tsJestTransformCfg,
  },
};
