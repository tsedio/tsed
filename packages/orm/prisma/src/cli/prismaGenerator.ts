import path, {join} from "node:path";
import {GeneratorOptions} from "@prisma/generator-helper";
import fs from "fs-extra";
import {generateCode} from "../generator/generateCode.js";
import internals from "@prisma/internals";
import removeDir from "../generator/utils/removeDir.js";

function parseStringBoolean(stringBoolean: string | string[] | undefined) {
  return Boolean(stringBoolean ? stringBoolean === "true" : undefined);
}

function toUnixPath(maybeWindowsPath: string) {
  return maybeWindowsPath.split("\\").join("/");
}

export interface GenerateOptions {
  defaultOutput: string;
  packageDir: string;
}

/**
 * Name (without extension) of the barrel file each supported Prisma client generator emits at the root of its output directory.
 */
const CLIENT_ENTRY_BY_PROVIDER: Record<string, string> = {
  "prisma-client": "client",
  "prisma-client-js": "index"
};

export interface ClientGenerator {
  output: string;
  entry: string;
}

export function resolveClientGenerator(otherGenerators: GeneratorOptions["otherGenerators"]): ClientGenerator {
  const clientGenerator = otherGenerators.find((it) => internals.parseEnvValue(it.provider) in CLIENT_ENTRY_BY_PROVIDER);

  if (!clientGenerator) {
    throw new Error(
      `@tsed/prisma requires a Prisma client generator ("prisma-client" or "prisma-client-js") declared in your schema.prisma. Add one of the following blocks:\n\n` +
        `generator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n`
    );
  }

  const provider = internals.parseEnvValue(clientGenerator.provider);
  const output = clientGenerator.output ? internals.parseEnvValue(clientGenerator.output) : undefined;

  if (!output) {
    throw new Error(
      `The "${provider}" generator must declare an explicit "output" path so @tsed/prisma can resolve the generated Prisma client import. ` +
        `Add an "output" property to your "${provider}" generator block in schema.prisma.`
    );
  }

  return {output, entry: CLIENT_ENTRY_BY_PROVIDER[provider]};
}

export function generate({defaultOutput, packageDir}: GenerateOptions) {
  return async (options: GeneratorOptions) => {
    const outputDir = internals.parseEnvValue(options.generator.output!);
    await fs.mkdir(outputDir, {recursive: true});
    await removeDir(outputDir, true);

    const generatorConfig = options.generator.config;
    const {output: prismaClientPath, entry: prismaClientEntry} = resolveClientGenerator(options.otherGenerators);

    await generateCode(options.dmmf, {
      emitTranspiledCode: parseStringBoolean(generatorConfig.emitTranspiledCode),
      outputDirPath: outputDir,
      prismaClientPath: prismaClientPath.includes("node_modules")
        ? "@prisma/client"
        : toUnixPath(path.relative(outputDir, prismaClientPath)),
      prismaClientEntry
    });

    if (outputDir === defaultOutput) {
      await fs.copy(join(packageDir, "scripts", "backup-index.esm.js"), join(packageDir, "lib", "esm", "index.js"));
      await fs.copy(join(packageDir, "scripts", "backup-index.d.mts"), join(packageDir, "lib", "types", "index.d.ts"));
      await fs.writeJson(`${outputDir}/package.json`, {
        type: "module"
      });
    }

    return "";
  };
}
