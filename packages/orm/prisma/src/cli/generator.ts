import {generatorHandler} from "@prisma/generator-helper";
import {generate} from "./prismaGenerator";
import {join} from "path";

generatorHandler({
  onManifest: () => ({
    defaultOutput: join(__dirname, "..", ".schema"),
    prettyName: "Ts.ED integration",
    requiresGenerators: ["prisma-client-js"]
  }),
  onGenerate: generate
});
