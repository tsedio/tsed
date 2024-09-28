import {ExportDeclarationStructure, OptionalKind, SourceFile} from "ts-morph";

import {resolveExtension} from "./resolveExtension.js";

export function generateOutputsBarrelFile(sourceFile: SourceFile, outputTypeNames: string[]) {
  sourceFile.addExportDeclarations(
    outputTypeNames.sort().map<OptionalKind<ExportDeclarationStructure>>((outputTypeName) => ({
      moduleSpecifier: resolveExtension(`./${outputTypeName}`),
      namedExports: [outputTypeName]
    }))
  );

  return sourceFile;
}
