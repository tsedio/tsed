import {join} from "path";
import {ModuleKind, Project, ScriptTarget} from "ts-morph";

const SNAPSHOT_DIR = `${__dirname}/../../test/snapshots`;

export function createProjectFixture(dir = "/") {
  const baseDir = join(SNAPSHOT_DIR, dir);
  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.ES2019,
      module: ModuleKind.CommonJS,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      esModuleInterop: true
    }
  });

  return {
    project,
    baseDir,
    render(file: string) {
      const absolutePath = join(baseDir, file);
      const sourceFile = project.getSourceFile(absolutePath);

      if (!sourceFile) {
        throw `File not found: ${file}`;
      }

      sourceFile.formatText({indentSize: 2});
      const actualValue = sourceFile.getFullText();

      return {
        ...expect(actualValue),
        toMatchSnapshot() {
          expect(actualValue).toMatchSnapshot();
        }
      };
    }
  };
}
