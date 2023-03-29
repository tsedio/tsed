import {GeneratorOptions} from "@prisma/generator-helper";
import {parseEnvValue} from "@prisma/internals";
import filedirname from "filedirname";
import fs from "fs-extra";
import {generateCode} from "../generator/generateCode";
import removeDir from "../generator/utils/removeDir";
import path, {join} from "path";

// FIXME remove when esm is ready
const [, rootDir] = filedirname();
export const defaultOutput = join(rootDir, "..", ".schema");
export const packageDir = join(rootDir, "..", "..", "..");

function parseStringBoolean(stringBoolean: string | undefined) {
  return Boolean(stringBoolean ? stringBoolean === "true" : undefined);
}

function toUnixPath(maybeWindowsPath: string) {
  return maybeWindowsPath.split("\\").join("/");
}

export async function generate(options: GeneratorOptions) {
  const outputDir = parseEnvValue(options.generator.output!);
  await fs.mkdir(outputDir, {recursive: true});
  await removeDir(outputDir, true);

  const generatorConfig = options.generator.config;
  const prismaClientProvider = options.otherGenerators.find((it) => parseEnvValue(it.provider) === "prisma-client-js")!;
  const prismaClientPath = parseEnvValue(prismaClientProvider.output!);

  await generateCode(options.dmmf, {
    emitTranspiledCode: parseStringBoolean(generatorConfig.emitTranspiledCode),
    outputDirPath: outputDir,
    prismaClientPath: prismaClientPath.includes("node_modules") ? "@prisma/client" : toUnixPath(path.relative(outputDir, prismaClientPath))
  });

  if (outputDir === defaultOutput) {
    await fs.copy(join(packageDir, "scripts", "backup-index.cjs.js"), join(packageDir, "lib", "cjs", "index.js"));
    await fs.copy(join(packageDir, "scripts", "backup-index.esm.js"), join(packageDir, "lib", "esm", "index.js"));
    await fs.copy(join(packageDir, "scripts", "backup-index.d.ts"), join(packageDir, "lib", "types", "index.d.ts"));
  }

  return "";
}
