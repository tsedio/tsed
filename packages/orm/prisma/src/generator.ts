#!/usr/bin/env node
import helpers from "@prisma/generator-helper";
import {join} from "path";

import {generate} from "./cli/prismaGenerator.js";

const rootDir = import.meta.dirname; // automatically replaced by tsed tools on build
export const defaultOutput = join(rootDir, "..", ".schema");
export const packageDir = join(rootDir, "..", "..");

helpers.generatorHandler({
  onManifest: () => ({
    defaultOutput,
    prettyName: "Ts.ED integration",
    requiresGenerators: ["prisma-client-js"]
  }),
  onGenerate: generate({defaultOutput, packageDir})
});
