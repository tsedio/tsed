import {generatorHandler} from "@prisma/generator-helper";
import {generate, defaultOutput} from "./prismaGenerator";

generatorHandler({
  onManifest: () => ({
    defaultOutput,
    prettyName: "Ts.ED integration",
    requiresGenerators: ["prisma-client-js"]
  }),
  onGenerate: generate
});
