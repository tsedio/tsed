import {ExportDeclarationStructure, OptionalKind, SourceFile} from "ts-morph";

export function generateOutputsBarrelFile(sourceFile: SourceFile, outputTypeNames: string[]) {
  sourceFile.addExportDeclarations(
    outputTypeNames.sort().map<OptionalKind<ExportDeclarationStructure>>((outputTypeName) => ({
      moduleSpecifier: `./${outputTypeName}`,
      namedExports: [outputTypeName]
    }))
  );

  return sourceFile;
}
