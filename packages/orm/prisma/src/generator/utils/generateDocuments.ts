import type {Directory, SourceFile, StatementStructures} from "ts-morph";

export function generateDocuments<T = any>(
  documents: any[],
  directory: Directory,
  transform: (document: T, sourceFile: SourceFile) => StatementStructures
): string[] {
  return documents.map((document) => {
    const sourceFile = directory.createSourceFile(`${document.toString()}.ts`, undefined, {overwrite: true});
    const statements = transform(document, sourceFile);

    if (document.importDeclarations) {
      sourceFile.addImportDeclarations(document.importDeclarations);
    }

    sourceFile.addStatements([statements]);

    return document.toString();
  });
}
