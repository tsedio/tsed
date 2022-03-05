import {GeneratorOptions} from "@prisma/generator-helper";
import {parseEnvValue} from "@prisma/sdk";
import {promises as asyncFs} from "fs";
import {generateCode} from "../generator/generateCode";
import removeDir from "../generator/utils/removeDir";
import path from "path";

function parseStringBoolean(stringBoolean: string | undefined) {
  return Boolean(stringBoolean ? stringBoolean === "true" : undefined);
}

function toUnixPath(maybeWindowsPath: string) {
  return maybeWindowsPath.split("\\").join("/");
}

export async function generate(options: GeneratorOptions) {
  const outputDir = parseEnvValue(options.generator.output!);
  await asyncFs.mkdir(outputDir, {recursive: true});
  await removeDir(outputDir, true);

  const generatorConfig = options.generator.config;
  const prismaClientProvider = options.otherGenerators.find((it) => parseEnvValue(it.provider) === "prisma-client-js")!;
  const prismaClientPath = parseEnvValue(prismaClientProvider.output!);

  await generateCode(options.dmmf, {
    emitTranspiledCode: parseStringBoolean(generatorConfig.emitTranspiledCode),
    outputDirPath: outputDir,
    prismaClientPath: prismaClientPath.includes("node_modules") ? "@prisma/client" : toUnixPath(path.relative(outputDir, prismaClientPath))
  });

  return "";
}
