import {DMMF} from "@prisma/generator-helper";
import {CompilerOptions, ModuleKind, Project, ScriptTarget} from "ts-morph";

import {generateClientIndex} from "./utils/generateClientIndex.js";
import {generateEnums} from "./utils/generateEnums.js";
import {generateIndex} from "./utils/generateIndex.js";
import {generateInterfaces} from "./utils/generateInterfaces.js";
import {generateModels} from "./utils/generateModels.js";
import {generatePrismaService} from "./utils/generatePrismaService.js";
import {generateRepositories} from "./utils/generateRepositories.js";
import {saveProject} from "./utils/saveProject.js";

const baseCompilerOptions: CompilerOptions = {
  target: ScriptTarget.ESNext,
  module: ModuleKind.ESNext,
  emitDecoratorMetadata: true,
  experimentalDecorators: true,
  esModuleInterop: true
};

export interface GenerateCodeOptions {
  emitTranspiledCode: boolean;
  outputDirPath: string;
  prismaClientPath: string;
}

export async function generateCode(dmmf: DMMF.Document, options: GenerateCodeOptions) {
  const baseDirPath = options.outputDirPath;
  const emitTranspiledCode = options.emitTranspiledCode ? true : options.outputDirPath.includes("node_modules");

  const project = new Project({
    compilerOptions: {
      ...baseCompilerOptions,
      ...(emitTranspiledCode && {declaration: true})
    }
  });

  const hasEnum = generateEnums(dmmf, project, baseDirPath);
  generateModels(dmmf, project, baseDirPath);
  generateInterfaces(project, baseDirPath);
  generateClientIndex(project, baseDirPath, options);
  generatePrismaService(project, baseDirPath);
  generateRepositories(dmmf, project, baseDirPath);
  generateIndex(project, baseDirPath, hasEnum);

  if (emitTranspiledCode) {
    await project.emit();
  } else {
    await saveProject(project);
  }
}
