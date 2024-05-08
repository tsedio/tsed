#!/usr/bin/env ts-node
import {generatorHandler} from "@prisma/generator-helper";
import {join} from "path";
import {generate} from "./cli/prismaGenerator";

const rootDir = __dirname; // automatically replaced by tsed tools on build
export const defaultOutput = join(rootDir, "..", ".schema");
export const packageDir = join(rootDir, "..", "..", "..");

generatorHandler({
  onManifest: () => ({
    defaultOutput,
    prettyName: "Ts.ED integration",
    requiresGenerators: ["prisma-client-js"]
  }),
  onGenerate: generate({defaultOutput, packageDir})
});
